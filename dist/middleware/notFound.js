const notFound = (req, res) => {
    res.status(404).json({ error: "So'rov url topilmadi" });
};
export default notFound;
