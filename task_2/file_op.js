const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        transport,
        new winston.transports.Console()
    ]
});

const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                logger.error(`Error reading file: ${filePath}. Error: ${err.message}`);
                return reject(err);
            }
            logger.info(`Successfully read file: ${filePath}`);
            resolve(data);
        });
    });
};

const writeFile = (filePath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
                logger.error(`Error writing file: ${filePath}. Error: ${err.message}`);
                return reject(err);
            }
            logger.info(`Successfully wrote to file: ${filePath}`);
            resolve();
        });
    });
};

const appendTimestamp = (content) => {
    const timestamp = new Date().toISOString();
    return `${content}\n\nTimestamp: ${timestamp}`;
};

const processFile = async (inputFile, outputFile) => {
    try {
        const content = await readFile(inputFile);
        const updatedContent = appendTimestamp(content);
        await writeFile(outputFile, updatedContent);
    } catch (error) {
        logger.error('An error occurred during the file operations.');
    }
};

const inputFile = path.join(__dirname, 'input.txt');
const outputFile = path.join(__dirname, 'output.txt');

processFile(inputFile, outputFile);
