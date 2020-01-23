# Downloader for mockup products data

Javascript allow download and manipulate mock data for products (in json).

## Source data

Source file git: https://github.com/BestBuyAPIs/open-data-set (products.json).

### How to use it

If u only need download images just run

```
node run products-mocker.js
```

But there are many of products (ca. 60k) and download images for all of it, could take hours... So if u need a sample of products u could set env flag and run script like that:

```
CREATE_SAMPLE=true node products-mocker.js 
```

Result of above script will be file products-sample.json in 'data' directory

Default max products in sample is seted on 1k but u can change it by (i.e to 2k):

```
MAX_ITEMS=2000 CREATE_SAMPLE=true node products-mocker.js 
```

Example of item:

```
{
    "sku": 43900,
    "name": "Duracell - AAA Batteries (4-Pack)",
    "type": "HardGood",
    "price": 5.49,
    "upc": "041333424019",
    "category": [
      {
        "id": "pcmcat312300050015",
        "name": "Connected Home & Housewares"
      },
      {
        "id": "pcmcat248700050021",
        "name": "Housewares"
      },
      {
        "id": "pcmcat303600050001",
        "name": "Household Batteries"
      },
      {
        "id": "abcat0208002",
        "name": "Alkaline Batteries"
      }
    ],
    "shipping": 5.49,
    "description": "Compatible with select electronic devices; AAA size; DURALOCK Power Preserve technology; 4-pack",
    "manufacturer": "Duracell",
    "model": "MN2400B4Z",
    "url": "http://www.bestbuy.com/site/duracell-aaa-batteries-4-pack/43900.p?id=1051384074145&skuId=43900&cmp=RMXCC",
    "image": "http://img.bbystatic.com/BestBuy_US/images/products/4390/43900_sa.jpg"
  }
  ```
  U could change others env which will affect on script behavior:
  ```
  const {
    MAX_ITEMS = 1000,
    CREATE_SAMPLE = false,
    FLAT_CATEGORY = true,
    SKU_TO_ID = true,
    REMOVE_URL = true,
  } = env;
  ```
  #### Notice - on default we remove url, replace sku by id and make category flat (array to single id) in our sample !
