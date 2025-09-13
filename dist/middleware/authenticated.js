const authenticated = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    next();
};
export default authenticated;
