import { useContext } from 'react';
import { AppContext } from '../App';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';

function CatList() {
  const { cats } = useContext(AppContext);

  return (
    <Box sx={{marginTop: 3}}>
      <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 18 }}>
        {cats.map((cat, index) => {
          return (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Card sx={{ maxWidth: 350 }}>
                <CardContent>
                  <CardMedia sx={{ height: 300, marginBottom: 2 }} image={cat.kuva} title={'Cat name ' + cat.nimi} />
                  <Typography gutterBottom variant="h5" component="div">
                    {cat.nimi}
                  </Typography>
                  <Typography variant="h6">{cat.sijainti}</Typography>
                </CardContent>
                <CardActions>
                  <Button>
                    <InfoIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
export default CatList;
