import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import WidgetDisplay from '../WidgetDisplay'
import {
  fetchAllUsers,
  fetchUsersByName
} from '../../lib/apiConnect'

const WidgetList = () => {
  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchError, setSearchError] = useState(null);


  useEffect(() => {
    refreshWidgets()
  }, [])

  const refreshWidgets = () => {
    setLoading(true);
    fetchAllUsers()
      .then(data => {
        setWidgets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users', error);
        setError(error);
        setLoading(false);
      });
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearchError(null);
    fetchUsersByName(searchTerm)
      .then((widget) => {
        setSearchResult(widget);
        setLoading(false);
      })
      .catch(() => {
        setSearchError(`User "${searchTerm}" not found.`);
        setSearchResult(null);
        setLoading(false);
      });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResult(null);
    refreshWidgets();
  };


  if (loading) return <CircularProgress>Loading...</CircularProgress>;
  if (error) return <Typography color="error">Error loading users.</Typography>;

  return (
    <Stack spacing={4} sx={{ margin: 'auto', maxWidth: 900, paddingTop: '4em', width: '100%' }}>
      <Stack direction="row" spacing={2} justifyContent="center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by widget name"
          style={{ padding: '0.5em', fontSize: '1em', width: '300px' }}
        />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
        <Button variant="outlined" onClick={clearSearch}>Clear</Button>
      </Stack>

      {searchError && (
        <Typography color="error" textAlign="center">{searchError}</Typography>
      )}

      <Typography sx={{ textAlign: 'center' }} variant="h3">
        Users
      </Typography>
      <Grid container justifyContent="center" spacing={4} sx={{ paddingRight: 4, width: '100%' }}>
        {widgets.length === 0 ? (
          <Typography>You have no available users. Please create some!</Typography>
        ) : (
          searchResult ? (
            Object.values(searchResult).length > 0 ?
              (searchResult.map((current) => <WidgetDisplay
                key={current.id}
                widget={current} />)) :
              <Typography>No users match the provided search term</Typography>
          ) : (
            widgets.map((current) => <WidgetDisplay
              key={current.id}
              widget={current} />)
          )
        )}
      </Grid>
    </Stack>
  )
}

export default WidgetList
