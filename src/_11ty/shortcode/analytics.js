const dev = process.env.NODE_ENV !== 'production';

module.exports = async function() {
    if (dev) {
        return `<!-- Fathom - beautiful, simple website analytics -->`;
    }

    return `<!-- Fathom - beautiful, simple website analytics -->
    <script src="https://kangaroo.websitecarbonaudit.com/script.js" data-site="KNUQDPTP" defer></script>
    <!-- / Fathom -->`;
};
