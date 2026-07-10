# Insight Dashboard

## Live Demo:
https://visualization-dashboard-1gkop99fx-mirza-ikrams-projects.vercel.app/

## Overview

Insight Dashboard is a full-stack web application built to visualize and analyze business insight data from the provided `jsondata.json` dataset. The dashboard presents key metrics such as **Intensity, Likelihood, Relevance, Year, Country, Region, Topics, and Sector** through interactive charts and filters, making it easier to explore trends and generate insights.

The application uses MongoDB as the data source, with a Next.js backend serving APIs for filtered data and aggregated statistics. The frontend provides an interactive dashboard where users can filter records and view updated visualizations in real time.

---

## Features

* Interactive dashboard with multiple charts and visualizations
* Dynamic filtering based on:

  * End Year
  * Topic
  * Sector
  * Region
  * PESTLE
  * Source
  * Country
* KPI cards displaying summary statistics
* Paginated data table
* MongoDB-powered filtering and aggregation
* Responsive user interface

---

## Technology Stack

### Frontend

* Next.js 14 (App Router)
* React
* Tailwind CSS
* Chart.js (`react-chartjs-2`)

### Backend

* Next.js API Routes
* MongoDB Atlas

---

## Project Structure

```text
insight-dashboard/
├── app/
│   ├── page.js
│   ├── layout.js
│   ├── globals.css
│   └── api/
│       ├── insights/
│       ├── filters/
│       └── stats/
│
├── components/
│   ├── FilterSidebar.js
│   ├── MultiSelectFilter.js
│   ├── KpiCards.js
│   ├── ChartCard.js
│   ├── DataTable.js
│   └── charts/
│
├── lib/
│   ├── mongodb.js
│   ├── queryBuilder.js
│   └── chartSetup.js
│
├── scripts/
│   └── seed.mjs
│
└── data/
    └── jsondata.json
```

---

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd insight-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and add your MongoDB Atlas credentials.

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=insight_dashboard
```

### 4. Import the Dataset

The project includes a seed script to import the provided JSON dataset into MongoDB.

```bash
npm run seed
```

This script:

* Imports data from `data/jsondata.json`
* Cleans and formats the dataset
* Creates the required database indexes

### 5. Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## API Endpoints

The project exposes three API endpoints:

### GET `/api/insights`

Returns filtered and paginated insight records.

### GET `/api/filters`

Returns distinct values used to populate dashboard filters.

### GET `/api/stats`

Returns aggregated statistics for charts and KPI cards.

---

## Dashboard Visualizations

The dashboard includes multiple visualizations, such as:

* KPI Summary Cards
* Topic Distribution
* Sector Distribution
* Country-wise Analysis
* Region-wise Analysis
* Intensity Distribution
* Trend Charts
* Paginated Data Table

All visualizations update dynamically based on the selected filters.

---

## Filtering

Users can filter the dashboard using:

* End Year
* Topic
* Sector
* Region
* PESTLE
* Source
* Country

The selected filters are applied consistently across both the charts and the data table.

---

## Database

The application uses MongoDB to store the dataset imported from `jsondata.json`. The backend performs filtering and aggregation directly in MongoDB, ensuring efficient data retrieval and minimizing processing on the client side.

---

## Data Notes

While working with the provided dataset, the following observations were made:

* The dataset does not contain `city` or `swot` fields; therefore, those filters are not available in the dashboard.
* Many records have missing values for `start_year` and `end_year`, so year-based visualizations only include records where those fields are available.

---

## Future Improvements

Possible enhancements for future versions include:

* Export dashboard data to CSV or Excel
* User authentication and authorization
* Additional chart types and analytics
* Dark mode support
* Advanced search functionality
* Dashboard customization options

---

## Conclusion

This project demonstrates the development of an interactive data visualization dashboard using a modern full-stack architecture. By integrating Next.js, MongoDB, React, Tailwind CSS, and Chart.js, the application provides an efficient platform for exploring business insight data through dynamic filtering and visual analytics.
