import React, { useState, useRef, useEffect } from 'react'

import Fab from '@material-ui/core/Fab'
import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'
// import Grid from '@material-ui/core/Grid'
import { Grid } from '@mui/material'
import { makeStyles, styled } from '@material-ui/core/styles'
import { graphql } from 'gatsby'

import DashboardLayout from '../_SHELL/layouts/dashboard'
import Layout from '../components/ui/layout'
import SEO from '../components/ui/seo'

import DynamicToolbar from '../components/product-list/DynamicToolbar'
import ListOfProducts from '../components/product-list/ListOfProducts'
import {
  alphabetic,
  time,
  price,
} from '../components/product-list/SortFunctions'

const useStyles = makeStyles(theme => ({
  fab: {
    alignSelf: 'flex-end',
    marginRight: '2rem',
    marginBottom: '2rem',
    color: '#fff',
    // backgroundColor: '#ff0000',
    fontFamily: 'Inter',
    borderRadius: '15px',
    fontSize: '5rem',
    width: '5rem',
    height: '5rem',
  },
  goodSpacing: {
    height: '200px',
    width: '100%',
    // position: 'static',
    // backgroundColor: '#555555',
  },
  goodContainer: {
    // backgroundColor: '#ff0000',
    // position: 'static',
    // top: '-500',
  },
  goodSeparation: {
    // backgroundColor: '#ff0000',
    // position: 'static',
    marginLeft: '1rem',
  },

  pagination: {
    alignSelf: 'flex-end',
    marginRight: '2%',
    fontFamily: 'Inter',
    marginTop: '-3rem',
    marginBottom: '4rem',
    [theme.breakpoints.only('md')]: {
      marginTop: '1rem',
    },
  },
}))

export const StyledPagination = props => {
  const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
    fontFamily: 'Inter',
    fontSize: '1.5rem',
    color: theme.palette.primary.main,
    '&.Mui-selected': {
      color: '#fff',
    },
  }))

  return (
    <Pagination
      {...props}
      renderItem={item => <StyledPaginationItem {...item} />}
    />
  )
}

export default function ProductList({
  pageContext: { filterOptions: options, name, description },
  data: {
    allStrapiProduct: { edges: products },
  },
}) {
  const classes = useStyles()
  const [layout, setLayout] = useState('grid')
  const [page, setPage] = useState(1)
  const [filterOptions, setFilterOptions] = useState(options)
  const [sortOptions, setSortOptions] = useState([
    { label: 'A-Z', active: true, function: data => alphabetic(data, 'asc') },
    { label: 'Z-A', active: false, function: data => alphabetic(data, 'desc') },
    { label: 'NEWEST', active: false, function: data => time(data, 'asc') },
    { label: 'OLDEST', active: false, function: data => time(data, 'desc') },
    { label: 'PRICE ↑', active: false, function: data => price(data, 'asc') },
    { label: 'PRICE ↓', active: false, function: data => price(data, 'desc') },
    { label: 'REVIEWS', active: false, function: data => data },
  ])
  const scrollRef = useRef(null)

  const scroll = () => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setPage(1)
  }, [filterOptions, layout])

  const productsPerPage = layout === 'grid' ? 16 : 6

  let content = []
  const selectedSort = sortOptions.filter(option => option.active)[0]
  const sortedProducts = selectedSort.function(products)

  sortedProducts.map((product, i) =>
    product.node.variants.map(variant => content.push({ product: i, variant }))
  )

  let isFiltered = false
  const filters = {}
  let filteredProducts = []

  Object.keys(filterOptions)
    .filter(option => filterOptions[option] !== null)
    .map(option => {
      filterOptions[option].forEach(value => {
        if (value.checked) {
          isFiltered = true

          if (filters[option] === undefined) {
            filters[option] = []
          }

          if (!filters[option].includes(value)) {
            filters[option].push(value)
          }

          content.forEach(item => {
            if (option === 'Color') {
              if (
                item.variant.colorLabel === value.label &&
                !filteredProducts.includes(item)
              ) {
                filteredProducts.push(item)
              }
            } else if (
              item.variant[option.toLowerCase()] === value.label &&
              !filteredProducts.includes(item)
            ) {
              filteredProducts.push(item)
            }
          })
        }
      })
    })

  Object.keys(filters).forEach(filter => {
    filteredProducts = filteredProducts.filter(item => {
      let valid

      filters[filter].some(value => {
        if (filter === 'Color') {
          if (item.variant.colorLabel === value.label) {
            valid = item
          }
        } else if (item.variant[filter.toLowerCase()] === value.label) {
          valid = item
        }
      })

      return valid
    })
  })

  if (isFiltered) {
    content = filteredProducts
  }

  const numPages = Math.ceil(content.length / productsPerPage)

  return (
    <>
      <DashboardLayout>
        <Layout>
          <SEO title={name} description={description} />
          <Grid container direction="column" alignItems="center">
            <div ref={scrollRef} />
            <DynamicToolbar
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              sortOptions={sortOptions}
              setSortOptions={setSortOptions}
              name={name}
              description={description}
              layout={layout}
              setLayout={setLayout}
            />
            <div className={classes.goodSpacing} />
            <div className={classes.goodContainer}>
              <ListOfProducts
                page={page}
                className={classes.goodSeparation}
                filterOptions={filterOptions}
                productsPerPage={productsPerPage}
                layout={layout}
                products={products}
                content={content}
              />
            </div>
            <StyledPagination
              count={numPages}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
              color="primary"
              classes={{ root: classes.pagination }}
            />
            <Fab
              onClick={scroll}
              color="primary"
              classes={{ root: classes.fab }}
            >
              ^
            </Fab>
          </Grid>
        </Layout>

        {/* <Grid container spacing={3} {...other}> */}
        <Grid container spacing={3}>
          {/* {products.map(product => ( */}
          <Grid item xs={12} sm={6} md={3}>
            //! INSERT CAR DATA HERE.
            {/* <ShopProductCard product={products} /> */}
          </Grid>
          {/* ))} */}

          {/* {isLoad && SkeletonLoad} */}
        </Grid>
      </DashboardLayout>
    </>
  )
}

export const query = graphql`
  query GetCategoryProducts($id: String!) {
    allStrapiProduct(filter: { category: { id: { eq: $id } } }) {
      edges {
        node {
          strapiId
          createdAt
          name
          category {
            name
          }
          variants {
            color
            id
            price
            size
            style
            colorLabel
            images {
              localFile {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
          }
        }
      }
    }
  }
`
