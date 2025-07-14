import fs from 'fs';
import path from 'path';

const logFilePath = path.join('logs', 'api_log.json');

if( !fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

function logRequest( {query, retrievedDocs, latencyMs, modelUsed} ) {
    const entry = {
        timestamp: new Date().toISOString,
        query,
        retrievedDocs: retrievedDocs,
        latency_ms: latencyMs,
        model_used: modelUsed,
    };
    fs.appendFileSync(logFilePath, JSON.stringify(entry) + '\n')
}

export default logRequest;