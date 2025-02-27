import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { formatDistanceToNow } from 'date-fns'
import { noCase } from 'change-case'
import { Icon } from '@iconify/react'
import bellFill from '@iconify/icons-eva/bell-fill'
import clockFill from '@iconify/icons-eva/clock-fill'
import doneAllFill from '@iconify/icons-eva/done-all-fill'
// next
// import NextLink from 'next/link'
import { Link as GatsbyLink } from 'gatsby'
// material
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material'
// utils
import mockData from '../../utils/mock-data'
// components
import Scrollbar from '../../components/Scrollbar'
import MenuPopover from '../../components/MenuPopover'
import { MIconButton } from '../../components/@material-extend'

// ----------------------------------------------------------------------

const TITLES = [
  'Your order is placed',
  'Sylvan King',
  'You have new message',
  'You have new mail',
  'Delivery processing',
]

const DESCRIPTIONS = [
  'waiting for shipping',
  'answered to your comment on the Minimal',
  '5 unread messages',
  'sent from Guido Padberg',
  'Your order is being shipped',
]

const TYPES = [
  'order_placed',
  'friend_interactive',
  'chat_message',
  'mail',
  'order_shipped',
]

const AVATARS = [null, mockData.image.avatar(2), null, null, null]

const UNREADS = [true, true, false, false, false]

const MOCK_NOTIFICATIONS = [...Array(5)].map((_, index) => ({
  id: mockData.id(index),
  title: TITLES[index],
  description: DESCRIPTIONS[index],
  avatar: AVATARS[index],
  type: TYPES[index],
  createdAt: mockData.time(index),
  isUnRead: UNREADS[index],
}))

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  )

  if (notification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_package.svg"
        />
      ),
      title,
    }
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    }
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_mail.svg"
        />
      ),
      title,
    }
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_chat.svg"
        />
      ),
      title,
    }
  }
  return {
    avatar: <img alt={notification.title} src={notification.avatar} />,
    title,
  }
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
}

function NotificationItem({ notification }) {
  const { avatar } = renderContent(notification)
  const { title } = renderContent(notification)

  return (
    <GatsbyLink to="#">
      <ListItemButton
        sx={{
          py: 1.5,
          px: 2.5,
          mt: '1px',
          ...(notification.isUnRead && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Box
                component={Icon}
                icon={clockFill}
                sx={{ mr: 0.5, width: 16, height: 16 }}
              />
              {formatDistanceToNow(new Date(notification.createdAt))}
            </Typography>
          }
        />
      </ListItemButton>
    </GatsbyLink>
  )
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const totalUnRead = notifications.filter(
    item => item.isUnRead === true
  ).length

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        isUnRead: false,
      }))
    )
  }

  return (
    <>
      <MIconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <MIconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </MIconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                New
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 1 }}>
          <GatsbyLink to="#">
            <Button fullWidth disableRipple>
              View All
            </Button>
          </GatsbyLink>
        </Box>
      </MenuPopover>
    </>
  )
}
