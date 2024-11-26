export default {
    main: '/path/to/main.js', // The path should be relative to the project root
    build: {
        rollupOptions: {
            input: {
                main: '/g-home.js', // The path should be relative to the project root
                about: '/g-about.js',
                contact: '/g-contact.js',
                books: '/g-books.js',
                media: '/g-media.js',
                speaking: '/g-speaking.js',
                // Add more files as needed
            }
        }
    }
}