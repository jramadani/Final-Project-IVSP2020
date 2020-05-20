# About the Data

## What the Data Is

There are four datasets in this folder.

Two of the four are related; "nested.json" is a cleaned and aggregated subset of the other (spendingdatafinal.csv), which is a cleaned dataset of every record of budgetary spending of the 115th Congress's House of Representatives.

The dataset named "repinfo.csv" is a dataset of information regarding every representative in the 115th Congress, their social media, and other points of contact. Finally, the json file titled "cb_2017_us_cd115_5m.json" is a geospatial file of the 115th Congress's district mapping.

I will be referring to these files as "spending information," "representative information," and "the geojson" in ensuing sections.

## Where the Data Comes From

Both of the spending information datasets are combined subsets (2017 Q1 to 2019 Q1, or the span of the 115th Congress) of multiple datasets retrieved from [ProPublica](https://projects.propublica.org/represent/expenditures), which retrieved it from PDFs published by the House of Representatives regarding representative budget spending.

[The representative information dataset was obtained from this GitHub repository.](https://github.com/unitedstates/congress-legislators)

The geojson is a 2017 edition of Congressional Districts from the official website of the US Census, and can be found [here](https://www.census.gov/cgi-bin/geo/shapefiles/index.php) with the specified parameters.

## Cleaning and Analysis

All data cleaning and analysis was done using a combination of Excel, Python via Jupyter notebooks, and JavaScript via Observable notebooks.

The geojson was used as-obtained.

The representative information dataset was given a column with calculated GEOIDs that match the ones in the geojson, formulated using a combination of the [GEOID Structure for Geographic Areas](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) and an official PDF released by the Census, [found here](https://www2.census.gov/geo/pdfs/reference/GARM/Ch4GARM.pdf) on page 16 (Table 4-5). The "STATE" portion of the Congressional District formulation comes from the FIPS code in the PDF, and the "CD" portion comes natively from the dataset. Other than this, some columns with unused social media information were dropped, and some names were corrected for accents that were lost in file transfer.

The overarching spending information was heavily cleaned; null rows were dropped, rows with dates that didn't fall under their designated years were also dropped (ProPublica has an explanation for why this is the case, but for the purposes of this project, those expenditures did not technically fall under the specified year, and it would have been counterintuitive to include them), and certain columns were dropped from certain datasets in order to combine them. Because the data was issued as quarterly datasets, certain columns that were present in one dataset were not present in another. Datasets from 2017 Q1 to 2019 Q1 were standardized for combination and then concatenated.

The subset of the spending information is a JSON created from filtering the base dataset for the travel category, then dropping null dates, and finally creating a nested item. This dataset is used only for the calendar visualization in the narrative project, and all cleanings applied to this dataset have been applied to all of the visualizations within that project and the exploratory project via in-file JavaScript data manipulation.
