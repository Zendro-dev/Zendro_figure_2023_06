module.exports = `
  type country{
    """
    @original-field
    """
    country_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    population: Int

    """
    @original-field
    
    """
    size: Int

    """
    @original-field
    
    """
    river_ids: [String]

    """
    @original-field
    
    """
    capital_id: String

    capital(search: searchCityInput): city
    
    """
    @search-request
    """
    citiesFilter(search: searchCityInput, order: [ orderCityInput ], pagination: paginationInput!): [city]


    """
    @search-request
    """
    citiesConnection(search: searchCityInput, order: [ orderCityInput ], pagination: paginationCursorInput!): CityConnection

    """
    @count-request
    """
    countFilteredCities(search: searchCityInput) : Int
  
    """
    @search-request
    """
    riversFilter(search: searchRiverInput, order: [ orderRiverInput ], pagination: paginationInput!): [river]


    """
    @search-request
    """
    riversConnection(search: searchRiverInput, order: [ orderRiverInput ], pagination: paginationCursorInput!): RiverConnection

    """
    @count-request
    """
    countFilteredRivers(search: searchRiverInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type CountryConnection{
  edges: [CountryEdge]
  countries: [country]
  pageInfo: pageInfo!
}

type CountryEdge{
  cursor: String!
  node: country!
}

  enum countryField {
    country_id
    name
    population
    size
    river_ids
    capital_id
  }
  
  input searchCountryInput {
    field: countryField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchCountryInput]
  }

  input orderCountryInput{
    field: countryField
    order: Order
  }

  input bulkAssociationCountryWithCapital_idInput{
    country_id: ID!
    capital_id: ID!
  }

  type Query {
    countries(search: searchCountryInput, order: [ orderCountryInput ], pagination: paginationInput! ): [country]
    readOneCountry(country_id: ID!): country
    countCountries(search: searchCountryInput ): Int
    csvTableTemplateCountry: [String]
    countriesConnection(search:searchCountryInput, order: [ orderCountryInput ], pagination: paginationCursorInput! ): CountryConnection
    validateCountryForCreation(country_id: ID!, name: String, population: Int, size: Int , addCapital:ID  , addCities:[ID], addRivers:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateCountryForUpdating(country_id: ID!, name: String, population: Int, size: Int , addCapital:ID, removeCapital:ID   , addCities:[ID], removeCities:[ID] , addRivers:[ID], removeRivers:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateCountryForDeletion(country_id: ID!): Boolean!
    validateCountryAfterReading(country_id: ID!): Boolean!
    """
    countriesZendroDefinition would return the static Zendro data model definition
    """
    countriesZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addCountry(country_id: ID!, name: String, population: Int, size: Int , addCapital:ID  , addCities:[ID], addRivers:[ID] , skipAssociationsExistenceChecks:Boolean = false): country!
    updateCountry(country_id: ID!, name: String, population: Int, size: Int , addCapital:ID, removeCapital:ID   , addCities:[ID], removeCities:[ID] , addRivers:[ID], removeRivers:[ID]  , skipAssociationsExistenceChecks:Boolean = false): country!
    deleteCountry(country_id: ID!): String!
        bulkAssociateCountryWithCapital_id(bulkAssociationInput: [bulkAssociationCountryWithCapital_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCountryWithCapital_id(bulkAssociationInput: [bulkAssociationCountryWithCapital_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;