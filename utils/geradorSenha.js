import crypto from 'crypto';

export function gerarSenha() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(3, (err, buffer) => {
            if (err) return reject(err);
            const token = buffer.toString('hex').slice(0, 5);
            resolve(token);
        });
    });
}