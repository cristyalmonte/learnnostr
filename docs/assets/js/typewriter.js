document$.subscribe(() => {
    const instance = new Typewriter('#typewriter', {
        strings: [
            'social protocol', 
            'future of social media',
            'censorship-resistant network',
            'decentralized internet',
            'sovereign social layer',
            'open protocol',
        ],
        autoStart: true,
        loop: true,
    });
})