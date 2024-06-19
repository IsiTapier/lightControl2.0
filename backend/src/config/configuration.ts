export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    pokemonService: {
      apiKey: process.env.POKEMEON_KEY,
    },
    DATABASE_USER: 'test',
    DATABASE_PASSWORD: 123,
    PORT: 3000,
});


/*export default registerAs('database', () => ({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432
}));*/