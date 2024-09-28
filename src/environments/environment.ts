export const environment = {
    production: true,
    baseurl: 'https://api.spotify.com/v1/',
    clientID: '00ba17a75b5641aaba00ef7b581e7a0a',
    clientSecretID: 'f3195ce56491450895264c5c92710ca5',
    redirecturl: 'http://localhost:4200/log-user',
    app_permission:
        [
            'user-read-currently-playing ',
            'user-top-read ',
            'user-library-read ',
            'user-follow-modify ',
            'user-read-private ',
            'user-follow-read ',
            'ugc-image-upload ',
            'user-library-modify ',
            'playlist-modify-private ',
            'playlist-read-private ',
            'playlist-modify-public ',
            'user-modify-playback-state ',
            'user-read-playback-state ',
            'user-read-recently-played ',
            'app-remote-control ',
            'streaming ',
            'user-read-email'
        ]
};
