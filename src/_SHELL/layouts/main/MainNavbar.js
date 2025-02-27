import '@fontsource/barlow'
import '@fontsource/inter'
import '@fontsource/karla'
//! utilizes useRouter from Next to get the current path
// next
// import NextLink from 'next/link'
import { Link as GatsbyLink } from 'gatsby'
// import { useRouter } from 'next/router'
// material
import { styled } from '@mui/material/styles'
import React, { useState, useEffect } from 'react'
import { Box, Button, AppBar, Toolbar, Container } from '@mui/material'
// hooks
import useOffSetTop from '../../hooks/useOffSetTop'
// components
import Logo from '../../components/Logo'
import Label from '../../components/Label'
import { MHidden } from '../../components/@material-extend'
//
import MenuDesktop from './MenuDesktop'
import MenuMobile from './MenuMobile'
import navConfig from './MenuConfig'

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 88

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: APP_BAR_MOBILE,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('md')]: {
    height: APP_BAR_DESKTOP,
  },
}))

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}))

// ----------------------------------------------------------------------

export default function MainNavbar() {
  const isOffset = useOffSetTop(100)
  // const { pathname } = useRouter()
  //! New for gatsby configuration
  const [activePathname, setActivePathname] = useState('')
  useEffect(() => {
    setActivePathname(window && window.location ? window.location.pathname : '')
  }, [])
  console.log('activePathname', activePathname)

  // const isHome = pathname === '/'
  const isHome = activePathname === '/'

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            bgcolor: 'background.default',
            height: { md: APP_BAR_DESKTOP - 16 },
          }),
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <GatsbyLink to="/">
            <Logo />
          </GatsbyLink>
          <Label style={{ fontFamily: 'Inter' }} color="info" sx={{ ml: 1 }}>
            Car X
          </Label>
          <Box sx={{ flexGrow: 1 }} />

          <MHidden width="mdDown">
            <MenuDesktop
              isOffset={isOffset}
              isHome={isHome}
              navConfig={navConfig}
            />
          </MHidden>
          <Button variant="contained" target="_blank">
            <GatsbyLink style={{ color: '#fff' }} to="/dashboard/home">
              Get Started
            </GatsbyLink>
          </Button>

          <MHidden width="mdUp">
            <MenuMobile
              isOffset={isOffset}
              isHome={isHome}
              navConfig={navConfig}
            />
          </MHidden>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  )
}
