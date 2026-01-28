# Domain Layer

This folder contains the core domain concepts of the application.

## Sub-folders

geo / weather / energy / supporting : are the sub domains for the API being created for the news_site.

### geo : Shared geographical models and utilities to be used across domains

### weather : Authoritative weather domain - All weather data is sourced exclusively from SMHI

### energy : Electricity-only energy domain featuring quarterly data and forecasts

### supporting: Optional, user-initiated supporting features. Used for complementary services (e.g. air quality)

## Rules

1. Domain code must not depend on UI components
2. External APIs are accessed only via adapters
