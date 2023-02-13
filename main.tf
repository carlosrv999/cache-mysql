resource "azurerm_resource_group" "default" {
  name     = "default"
  location = "East US"
}

resource "azurerm_virtual_network" "default" {
  name                = "example-network"
  location            = azurerm_resource_group.default.location
  resource_group_name = azurerm_resource_group.default.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "default_1" {
  name                 = "example-subnet-1"
  resource_group_name  = azurerm_resource_group.default.name
  virtual_network_name = azurerm_virtual_network.default.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "default_2" {
  name                 = "example-subnet-2"
  resource_group_name  = azurerm_resource_group.default.name
  virtual_network_name = azurerm_virtual_network.default.name
  address_prefixes     = ["10.0.2.0/24"]
}
