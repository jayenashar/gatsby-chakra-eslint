//! utilizes useRouter from Next to get the current path

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link as ScrollLink } from 'react-scroll'
// next
// import { useRouter } from 'next/router';
// material
import { Box, Link, Container, Typography } from '@mui/material'
// components
import Logo from '../../components/Logo'
//
import MainNavbar from './MainNavbar'
import MainFooter from './MainFooter'

// ----------------------------------------------------------------------

MainLayout.propTypes = {
  children: PropTypes.node,
}

export default function MainLayout({ children }) {
  // const { pathname } = useRouter();
  //! New for gatsby configuration
  const [activePathname, setActivePathname] = useState('')
  useEffect(() => {
    setActivePathname(window && window.location ? window.location.pathname : '')
  }, [])
  console.log('activePathname', activePathname)

  // const isHome = pathname === '/'
  const isHome = activePathname === '/'

  return (
    <>
      <MainNavbar />
      <div>{children}</div>

      {!isHome ? (
        <MainFooter />
      ) : (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            position: 'relative',
            bgcolor: 'background.default',
          }}
        >
          <Container maxWidth="lg">
            <ScrollLink to="move_top" spy smooth>
              <Logo sx={{ mb: 1, mx: 'auto', cursor: 'pointer' }} />
            </ScrollLink>

            <Typography variant="caption" component="p">
              © All rights reserved
              <br /> made by &nbsp;
              <Link href="https://shopcarx.com/">shopcarx.com</Link>
            </Typography>
          </Container>
        </Box>
      )}
    </>
  )
}
