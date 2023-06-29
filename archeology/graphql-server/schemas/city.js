module.exports = `
  type city{
    """
    @original-field
    """
    city_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    founding_date: DateTime

    """
    @original-field
    
    """
    founding_culture: String

    """
    @original-field
    
    """
    surface_area: Int

    """
    @original-field
    
    """
    has_subway: Boolean

    """
    @original-field
    
    """
    population: Int

    """
    @original-field
    
    """
    country_id: String

    country(search: searchCountryInput): country
  capitalTo(search: searchCountryInput): country
    
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type CityConnection{
  edges: [CityEdge]
  cities: [city]
  pageInfo: pageInfo!
}

type CityEdge{
  cursor: String!
  node: city!
}

  enum cityField {
    city_id
    name
    founding_date
    founding_culture
    surface_area
    has_subway
    population
    country_id
  }
  
  input searchCityInput {
    field: cityField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchCityInput]
  }

  input orderCityInput{
    field: cityField
    order: Order
  }

  input bulkAssociationCityWithCountry_idInput{
    city_id: ID!
    country_id: ID!
  }

  type Query {
    cities(search: searchCityInput, order: [ orderCityInput ], pagination: paginationInput! ): [city]
    readOneCity(city_id: ID!): city
    countCities(search: searchCityInput ): Int
    csvTableTemplateCity: [String]
    citiesConnection(search:searchCityInput, order: [ orderCityInput ], pagination: paginationCursorInput! ): CityConnection
    validateCityForCreation(city_id: ID!, name: String, founding_date: DateTime, founding_culture: String, surface_area: Int, has_subway: Boolean, population: Int , addCountry:ID, addCapitalTo:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateCityForUpdating(city_id: ID!, name: String, founding_date: DateTime, founding_culture: String, surface_area: Int, has_subway: Boolean, population: Int , addCountry:ID, removeCountry:ID , addCapitalTo:ID, removeCapitalTo:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateCityForDeletion(city_id: ID!): Boolean!
    validateCityAfterReading(city_id: ID!): Boolean!
    """
    citiesZendroDefinition would return the static Zendro data model definition
    """
    citiesZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addCity(city_id: ID!, name: String, founding_date: DateTime, founding_culture: String, surface_area: Int, has_subway: Boolean, population: Int , addCountry:ID, addCapitalTo:ID   , skipAssociationsExistenceChecks:Boolean = false): city!
    updateCity(city_id: ID!, name: String, founding_date: DateTime, founding_culture: String, surface_area: Int, has_subway: Boolean, population: Int , addCountry:ID, removeCountry:ID , addCapitalTo:ID, removeCapitalTo:ID    , skipAssociationsExistenceChecks:Boolean = false): city!
    deleteCity(city_id: ID!): String!
        bulkAssociateCityWithCountry_id(bulkAssociationInput: [bulkAssociationCityWithCountry_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCityWithCountry_id(bulkAssociationInput: [bulkAssociationCityWithCountry_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;