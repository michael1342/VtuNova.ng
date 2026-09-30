const generateRequestID = () => {
    const now = new Date();

    // YYYYMMDDHHmm in Nigeria time (UTC+1).
    const timestamp = new Date(now.getTime() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16)
        .replace(/\D/g, '');

    const suffix = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 36).toString(36)
    ).join('');

    return `${timestamp}${suffix}`;
};

export default generateRequestID