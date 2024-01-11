http://localhost:4000/api/find/find POST
{
    "limit": "3-40",
    "tags": ["Стулья", "Ремонт"]
}


http://localhost:4000/api/find/advancedfind223 POST
{
    "limit": "1-20",
    "tags": ["Ремонт"],
    "stopTags": "",
    "publicDateFrom": "2021-01-01",
    "publicDateTo": "2024-02-01",
    "startDateFrom": "2021-01-01",
    "startDateTo": "2024-02-01",
    "endDateFrom": "2021-01-01",
    "endDateTo": "2024-02-01",
    "fz": "fz223",
    "region": "Алтайский край",
    "tenderNum": "32313031068",
    "customerName": "",
    "stopCustomerName": "",
    "inn": "7803002209",
    "priceFrom": 0 ,
    "priceTo": 1000000000,
    "enablePrice": true,
    "source": "https://lk.zakupki.gov.ru",
    "enableSource": true,
    "okpd2": "Услуги по ремонту и монтажу машин и оборудования"
}



http://localhost:4000/api/find/32313031068 GET


http://localhost:4000/api/lk/mytenders POST
{
    "regNum": "32312961464"
}


http://localhost:4000/api/lk/mytenders GET


http://localhost:4000/api/lk/mytenders/32313031068 DELETE