import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Grid, Snackbar, Alert } from '@mui/material';
import Cards from "../../components/cityCard";
import Sidebar from "../../components/sidebar";
import Pagination from '@mui/material/Pagination';
import { getCities, getCityImageUrl } from "../../services/myCities";

//standarize card heights

const parsePrice = (priceStr) => {
  return parseInt(String(priceStr).replace(/[$,]/g, ''), 10);
};

function explore() {
  const [sortOrder, setSortOrder] = useState('default');
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function fetchCities() {
      try {
        const data = await getCities();
        setCities(data);
      } catch (err) {
        console.error('Failed to fetch cities:', err.message);
      }
    }
    fetchCities();
  }, []);

  // Filter cities based on search (and later: population, climate)
  const getFilteredCities = () => {
    let result = cities;

    if (searchTerm) {
      result = result.filter(city =>
        city.title.toLowerCase().startsWith(searchTerm.toLowerCase()) || city.state.toLowerCase().startsWith(searchTerm.toLowerCase()) || city.abbrev.toLowerCase() === searchTerm.toLowerCase());
    }
    // Future filters go here:
    // if (population !== 'all') { result = result.filter(...) }
    // if (climate !== 'all') { result = result.filter(...) }

    return result;
  };

  // Sort cities by price
  const getSortedCities = (cities) => {
    if (sortOrder === 'low-to-high') {
      return [...cities].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }
    if (sortOrder === 'high-to-low') {
      return [...cities].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }
    return cities;
  };

  const filteredCities = getFilteredCities();
  const sortedCities = getSortedCities(filteredCities);

  const noItems = 20;
  const [page, setPage] = useState(1);
  const handleChange = (e, value) => {
    setPage(value);
  }
  const totalPages = Math.ceil(sortedCities.length / noItems);
  const startInd = (page - 1) * noItems;
  const endInd = startInd + noItems;
  const paginatedCities = sortedCities.slice(startInd, endInd);

  useEffect(() => {
    setPage(1)
  }, [searchTerm, sortOrder])

  const [alertMsg, setAlertMsg] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (compareList.length === 2) {
      navigate(`/compare/${compareList[0]}/${compareList[1]}`);
      setCompareList([]);
    }
  }, [compareList, navigate]);

  const handleCompare = (slug) => {
    setCompareList(prev => {
        if (prev.includes(slug)) {
            setAlertMsg(null)
            setTimeout(() => setAlertMsg('Removed from Comparision'), 100)
            return prev.filter(s => s !== slug);
        }
        const updated = [...prev, slug];
        const city = cities.find(c => c.slug === slug);
        if (updated.length < 2) {
            setAlertMsg(null);
            setTimeout(() => setAlertMsg(`${city?.title || slug} selected - pick another city to compare`))
        }
        return updated;
    });
  };



  return (
    <>
      <Box
      sx={{
        ml: '-10px',
        px: {xs: 2, md: 0}
      }}
      >
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 3}}>
            <Sidebar sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container spacing={3}
            sx={{
              pt: 3,
            }}
            >
              {sortedCities.length === 0 ? (
                  <Grid size={12}>
                    <Box sx={{ textAlign: 'center', py: 5, color: '#545454', fontFamily: '"Pontano Sans", sans-serif', fontSize: '1.5rem' }}>
                      No matching cities have been found
                    </Box>
                  </Grid>
                ) : (
                  paginatedCities.map((city) => (
                    <Grid size={{ xs: 12, md: 6 }} key={city.id}>
                      <Cards
                        title={city.title}
                        abbrev={city.abbrev}
                        image={getCityImageUrl(city.slug, 1)}
                        subtitle={city.subtitle}
                        slug={city.slug}
                        onCompare={handleCompare}
                        isComparing={compareList.includes(city.slug)}
                      />
                    </Grid>
                    
                  ))
                )}
                {sortedCities.length > 0 && 
                  <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2, '& .Mui-selected': {
                  backgroundColor: '#97D071',
                } }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handleChange}
                      // showFirstButton
                      // showLastButton
                    />
                
                </Grid>}
            </Grid>
          </Grid>
        </Grid>

      </Box>
      <Snackbar
          open={!!alertMsg}
          autoHideDuration={2500}
          onClose={() => setAlertMsg(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
          <Alert onClose={() => setAlertMsg(null)} severity="success" variant="standard">
              {alertMsg}
          </Alert>
      </Snackbar>
    </>
  )
}

export default explore;