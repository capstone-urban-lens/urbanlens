import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import Cards from "../../components/cityCard";
import Sidebar from "../../components/sidebar";
import Pagination from '@mui/material/Pagination';
import { getCities, getCityImageUrl } from "../../services/myCities";

//standarize card heights

const parsePrice = (priceStr) => {
  return parseInt(String(priceStr).replace(/[$,]/g, ''), 10);
};

const computeCutoffs = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    low: sorted[Math.floor(0.33 * (sorted.length - 1))],
    high: sorted[Math.floor(0.67 * (sorted.length - 1))],
  };
};

function explore() {
  const [sortOrder, setSortOrder] = useState('default');
  const [population, setPopulation] = useState('');
  const [climate, setClimate] = useState('');
  const [qolRange, setQolRange] = useState([0, 100]);
  const [education, setEducation] = useState('');
  const [costIndex, setCostIndex] = useState('');
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradRateCutoffs, setGradRateCutoffs] = useState(null);
  const [costIndexCutoffs, setCostIndexCutoffs] = useState(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const data = await getCities();
        setCities(data);

        const gradRates = data.map(c => parseInt(String(c.hs_grad_rate).replace('%', ''), 10)).filter(v => !isNaN(v));
        const costIndices = data.map(c => parseInt(String(c.cost_index), 10)).filter(v => !isNaN(v));
        if (gradRates.length) setGradRateCutoffs(computeCutoffs(gradRates));
        if (costIndices.length) setCostIndexCutoffs(computeCutoffs(costIndices));
      } catch (err) {
        console.error('Failed to fetch cities:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  const getFilteredCities = () => {
    let result = cities;

    if (searchTerm) {
      result = result.filter(city =>
        city.title.toLowerCase().startsWith(searchTerm.toLowerCase()) || city.state.toLowerCase().startsWith(searchTerm.toLowerCase()) || city.abbrev.toLowerCase() === searchTerm.toLowerCase());
    }

    if (population) {
      result = result.filter(city => {
        const pop = parseInt(String(city.population).replace(/,/g, ''), 10);
        if (isNaN(pop)) return false;
        if (population === 'smallTowns') return pop < 50000;
        if (population === 'midSize') return pop >= 50000 && pop < 250000;
        if (population === 'largeCities') return pop >= 250000 && pop < 1000000;
        if (population === 'majorMetros') return pop >= 1000000;
        return true;
      });
    }

    if (climate) {
      const climateMap = { warm: 'Warm', mild: 'Mild', snowy: 'Snowy', fourSeasons: 'Four Seasons' };
      result = result.filter(city => city.weather === climateMap[climate]);
    }

    if (qolRange[0] > 0 || qolRange[1] < 100) {
      result = result.filter(city => {
        const qol = parseInt(String(city.qol).split('/')[0], 10);
        if (isNaN(qol)) return false;
        return qol >= qolRange[0] && qol <= qolRange[1];
      });
    }

    if (education && gradRateCutoffs) {
      result = result.filter(city => {
        const rate = parseInt(String(city.hs_grad_rate).replace('%', ''), 10);
        if (isNaN(rate)) return false;
        if (education === 'high') return rate > gradRateCutoffs.high;
        if (education === 'avg') return rate >= gradRateCutoffs.low && rate <= gradRateCutoffs.high;
        if (education === 'low') return rate < gradRateCutoffs.low;
        return true;
      });
    }

    if (costIndex && costIndexCutoffs) {
      result = result.filter(city => {
        const idx = parseInt(String(city.cost_index), 10);
        if (isNaN(idx)) return false;
        if (costIndex === 'high') return idx > costIndexCutoffs.high;
        if (costIndex === 'avg') return idx >= costIndexCutoffs.low && idx <= costIndexCutoffs.high;
        if (costIndex === 'low') return idx < costIndexCutoffs.low;
        return true;
      });
    }

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
    return [...cities].sort((a, b) => a.title.localeCompare(b.title));
  };

  const filteredCities = getFilteredCities();
  const sortedCities = getSortedCities(filteredCities);

  const noItems = 20;
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  }
  const totalPages = Math.ceil(sortedCities.length / noItems);
  const startInd = (page - 1) * noItems;
  const endInd = startInd + noItems;
  const paginatedCities = sortedCities.slice(startInd, endInd);

  useEffect(() => {
    setPage(1)
  }, [searchTerm, sortOrder, population, climate, qolRange, education, costIndex])

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
            <Sidebar
              sortOrder={sortOrder} setSortOrder={setSortOrder}
              population={population} setPopulation={setPopulation}
              climate={climate} setClimate={setClimate}
              qolRange={qolRange} setQolRange={setQolRange}
              education={education} setEducation={setEducation}
              costIndex={costIndex} setCostIndex={setCostIndex}
              gradRateCutoffs={gradRateCutoffs}
              costIndexCutoffs={costIndexCutoffs}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container spacing={3}
            sx={{
              pt: 3,
            }}
            >
              {loading ? (
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                      <CircularProgress color="primary" aria-label="loading" />
                    </Box>
                  </Grid>
                ) : sortedCities.length === 0 ? (
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