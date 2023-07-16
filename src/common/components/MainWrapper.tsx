import { BASE_URL, RestEndpoints, Roles, Routes } from '@/common/constants'
import { IMenu, IUser } from '@/common/interfaces'
import { loadLS } from '@/utils'
import CategoryIcon from '@mui/icons-material/Category'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import MenuIcon from '@mui/icons-material/Menu'
import PasswordIcon from '@mui/icons-material/Password'
import PersonIcon from '@mui/icons-material/Person'
import StyleIcon from '@mui/icons-material/Style'
import {
  AppBar,
  AppBarProps,
  Avatar,
  Box,
  CSSObject,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import axios from 'axios'
import {
  FC,
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LogoutBtn from './LogoutBtn'

const MENU: IMenu[] = [
  {
    id: '1',
    name: 'Dashboard',
    icon: <DashboardIcon sx={{ color: '#000' }} />,
    link: '/',
  },
  {
    id: '2',
    name: 'Category',
    icon: <CategoryIcon sx={{ color: '#000' }} />,
    link: `/${Routes.CATEGORY}`,
  },
  {
    id: '3',
    name: 'Book',
    icon: <LibraryBooksIcon sx={{ color: '#000' }} />,
    link: `/${Routes.BOOK}`,
  },
  {
    id: '4',
    name: 'Author',
    icon: <LocalLibraryIcon sx={{ color: '#000' }} />,
    link: `/${Routes.AUTHOR}`,
  },
  {
    id: '5',
    name: 'Customer',
    icon: <PersonIcon sx={{ color: '#000' }} />,
    link: `/${Routes.CUSTOMER}`,
  },
  {
    id: '6',
    name: 'Borrow Ticket',
    icon: <StyleIcon sx={{ color: '#000' }} />,
    link: `/${Routes.BORROW}`,
  },
  {
    id: '7',
    name: 'Librarian',
    icon: <ManageAccountsIcon sx={{ color: '#000' }} />,
    link: `/${Routes.LIBRARIAN}`,
  },
]

const USER_MENU: IMenu[] = [
  {
    id: '1',
    name: 'Password',
    icon: <PasswordIcon sx={{ color: '#000' }} />,
    link: `/${Routes.CHANGE_PASSWORD}`,
  },
]

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface CustomAppBarProps extends AppBarProps {
  open?: boolean
}

const CustomAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<CustomAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const CustomDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const MiniDrawer: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(true)
  const [userInfo, setUserInfo] = useState<{
    name: string
    role: string
    isLoading: boolean
  }>({ name: '', role: '', isLoading: false })

  const toggleDrawer = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    const token = loadLS('token')

    if (!token) return

    setUserInfo((prev) => ({ ...prev, isLoading: true }))

    axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.WHO_AM_I}`,
    })
      .then((res: { data: IUser }) => {
        if (!res.data) return
        setUserInfo({
          name: res.data.name,
          role: res.data.role,
          isLoading: false,
        })
      })
      .catch((err) => console.error('[ERROR][whoAmI]: ', err))
      .finally(() => setUserInfo((prev) => ({ ...prev, isLoading: false })))

    return () => {}
  }, [])

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      <CustomAppBar position='fixed' open={open}>
        <Toolbar>
          <Stack
            flexDirection='row'
            alignItems='center'
            gap={4}
            sx={{ width: '100%' }}>
            <Tooltip
              placement='right'
              title={open ? 'Close Menu' : 'Open Menu'}>
              <IconButton
                color='inherit'
                aria-label={open ? 'open menu' : 'close menu'}
                onClick={toggleDrawer}
                edge='start'
                sx={{ mr: 5 }}>
                {!open ? (
                  <MenuIcon sx={{ color: '#fff' }} />
                ) : (
                  <ChevronLeftIcon sx={{ color: '#fff' }} />
                )}
              </IconButton>
            </Tooltip>

            <Typography
              variant='h6'
              textAlign='start'
              fontWeight={900}
              color={'#fff'}
              sx={{ flex: 1, textTransform: 'uppercase' }}>
              Khoa Library
            </Typography>

            <Stack direction='row' alignItems='center' gap={2}>
              {userInfo.isLoading ? (
                <Skeleton width='100px' />
              ) : (
                <Fragment>
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      border: '3px solid #fff',
                      fontWeight: 600,
                    }}>
                    {userInfo.name.charAt(0).toUpperCase()}
                  </Avatar>

                  <Typography variant='h6' fontWeight={600} color={'#fff'}>
                    {userInfo.name}
                  </Typography>
                </Fragment>
              )}
            </Stack>

            <LogoutBtn />
          </Stack>
        </Toolbar>
      </CustomAppBar>

      <CustomDrawer variant='permanent' open={open}>
        <DrawerHeader />

        <List sx={{ flex: 1 }}>
          {MENU.map((item) => {
            if (userInfo.role !== Roles.ADMIN && item.name === 'Librarian')
              return

            return (
              <ListItem
                key={item.id}
                disablePadding
                sx={{
                  display: 'block',
                  bgcolor:
                    location.pathname === item.link ||
                    `/${location.pathname.split('/')[1]}` === item.link
                      ? 'primary.light'
                      : 'unset',
                  '&:hover': { bgcolor: 'primary.light' },
                }}>
                <ListItemButton
                  disableRipple
                  onClick={() => navigate(item.link)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': { bgcolor: 'unset' },
                  }}>
                  <Tooltip title={open ? '' : item.name} placement='right'>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}>
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>

                  <ListItemText
                    primary={item.name}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Divider />

        <List>
          {USER_MENU.map((item) => (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                display: 'block',
                backgroundColor:
                  location.pathname === item.link ||
                  `/${location.pathname.split('/')[1]}` === item.link
                    ? 'primary.light'
                    : 'unset',
                '&:hover': { bgcolor: 'primary.light' },
              }}>
              <ListItemButton
                disableRipple
                onClick={() => navigate(item.link)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&:hover': { bgcolor: 'unset' },
                }}>
                <Tooltip title={open ? '' : item.name} placement='right'>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}>
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>

                <ListItemText
                  primary={item.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CustomDrawer>

      <Box
        component='main'
        sx={{
          mt: '64px',
          width: '100%',
          height: '100%',
          display: 'flex',
          direction: 'column',
          overflow: 'auto',
          p: 3,
        }}>
        {children}
      </Box>
    </Box>
  )
}

export default MiniDrawer
