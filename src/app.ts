import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRoutes from './routes/userRoutes';
import artistsRoutes from './routes/artistsRoutes'
import albumRoutes from './routes/albumRoutes';
import trackRoutes from './routes/tracksRoutes';
import favoriteRoutes from './routes/favoritesRoutes';

const app = express();

app.use(express.json());


app.get('/api/v1', (req, res, next) => {
  res.json({status: 200,  message: "Welcome to Music Library"});
});

app.use('/api/v1', userRoutes, artistsRoutes, albumRoutes, trackRoutes, favoriteRoutes);

app.use(globalErrorHandler);

export default app;