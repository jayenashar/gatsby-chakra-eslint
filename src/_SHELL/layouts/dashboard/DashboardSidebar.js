//! utilizes useRouter from Next to get the current path
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
// next
// import NextLink from 'next/link'
import { Link as GatsbyLink } from 'gatsby'
// import { useRouter } from 'next/router'
// material
import { alpha, styled } from '@mui/material/styles'
import {
  Box,
  Stack,
  Avatar,
  Drawer,
  Tooltip,
  Typography,
  CardActionArea,
} from '@mui/material'
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer'
import avatar_default from '../../static/mock-images/avatars/avatar_default.jpg'

// components
import Logo from '../../components/Logo'
import Scrollbar from '../../components/Scrollbar'
import NavSection from '../../components/NavSection'
//
import { MHidden } from '../../components/@material-extend'
import sidebarConfig from './SidebarConfig'

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280
const COLLAPSE_WIDTH = 102

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex,
    }),
  },
}))

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12],
}))

// ----------------------------------------------------------------------

IconCollapse.propTypes = {
  onToggleCollapse: PropTypes.func,
  collapseClick: PropTypes.bool,
}

function IconCollapse({ onToggleCollapse, collapseClick }) {
  return (
    <Tooltip title="Mini Menu">
      <CardActionArea
        onClick={onToggleCollapse}
        sx={{
          width: 18,
          height: 18,
          display: 'flex',
          cursor: 'pointer',
          borderRadius: '50%',
          alignItems: 'center',
          color: 'text.primary',
          justifyContent: 'center',
          border: 'solid 1px currentColor',
          ...(collapseClick && {
            borderWidth: 2,
          }),
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'currentColor',
            transition: theme => theme.transitions.create('all'),
            ...(collapseClick && {
              width: 0,
              height: 0,
            }),
          }}
        />
      </CardActionArea>
    </Tooltip>
  )
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
}

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  //! New for gatsby configuration
  const [activePathname, setActivePathname] = useState('')
  useEffect(() => {
    setActivePathname(window && window.location ? window.location.pathname : '')
  }, [])
  console.log('activePathname', activePathname)
  // const { pathname } = useRouter()

  const {
    isCollapse,
    collapseClick,
    collapseHover,
    onToggleCollapse,
    onHoverEnter,
    onHoverLeave,
  } = useCollapseDrawer()

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePathname])

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: 'center',
          }),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <GatsbyLink to="/">
            <Box sx={{ display: 'inline-flex' }}>
              <Logo />
            </Box>
          </GatsbyLink>

          <MHidden width="lgDown">
            {!isCollapse && (
              <IconCollapse
                onToggleCollapse={onToggleCollapse}
                collapseClick={collapseClick}
              />
            )}
          </MHidden>
        </Stack>

        {isCollapse ? (
          <Avatar
            alt="My Avatar"
            src={avatar_default}
            sx={{ mx: 'auto', mb: 2 }}
          />
        ) : (
          <GatsbyLink to="#">
            <AccountStyle>
              <Avatar alt="My Avatar" src={avatar_default} />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  Guest User
                </Typography>
                {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  role
                </Typography> */}
              </Box>
            </AccountStyle>
          </GatsbyLink>
        )}
      </Stack>

      <NavSection navConfig={sidebarConfig} isShow={!isCollapse} />
    </Scrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                borderRight: 0,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
                boxShadow: theme => theme.customShadows.z20,
                bgcolor: theme => alpha(theme.palette.background.default, 0.88),
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  )
}
