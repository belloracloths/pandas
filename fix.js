const fs = require('fs');
const file = 'app/admin/layout.jsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/className=\{\x07dmin-link\}/g, 'className="admin-link"');
fs.writeFileSync(file, text);
