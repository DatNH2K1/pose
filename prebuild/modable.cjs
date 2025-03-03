const { cpSync } = require('fs');

const filesToCopy = [
    'modable.css',

    'light.css',
    'light-teal.css',
    'light-blue.css',

    'dark.css',
    'dark-blue.css',
    'dark-teal.css'
].map(item => ({
    src: 'node_modules/modable/dist/' + item,
    dest: 'public/css/' + item,
}));

const dirsToCopy = [
    {
        src: 'node_modules/modable/dist/fonts',
        dest: 'public/fonts',
    },
];

filesToCopy.forEach(({ src, dest }) => {
    try {
        cpSync(src, dest);
        console.log(`Copied: ${src} -> ${dest}`);
    } catch (error) {
        console.error(`Failed to copy: ${src} -> ${dest}`, error);
    }
});

dirsToCopy.forEach(({ src, dest }) => {
    try {
        cpSync(src, dest, { recursive: true });
        console.log(`Copied directory: ${src} -> ${dest}`);
    } catch (error) {
        console.error(`Failed to copy directory: ${src} -> ${dest}`, error);
    }
});
