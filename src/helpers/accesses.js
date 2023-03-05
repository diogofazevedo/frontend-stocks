const Accesses = {
  users: [
    { name: "read_users", description: "Visualizar utilizadores" },
    { name: "register_users", description: "Registar utilizadores" },
    { name: "edit_users", description: "Editar utilizadores" },
    { name: "delete_users", description: "Eliminar utilizadores" },
  ],
  roles: [
    { name: "read_roles", description: "Visualizar papéis" },
    { name: "create_roles", description: "Criar papéis" },
    { name: "edit_roles", description: "Editar papéis" },
    { name: "delete_roles", description: "Eliminar papéis" },
  ],
  products: [
    { name: "read_products", description: "Visualizar artigos" },
    { name: "create_products", description: "Criar artigos" },
    { name: "edit_products", description: "Editar artigos" },
    { name: "delete_products", description: "Eliminar artigos" },
  ],
  categories: [
    { name: "read_categories", description: "Visualizar categorias" },
    { name: "create_categories", description: "Criar categorias" },
    { name: "edit_categories", description: "Editar categorias" },
    { name: "delete_categories", description: "Eliminar categorias" },
  ],
  unities: [
    { name: "read_unities", description: "Visualizar unidades" },
    { name: "create_unities", description: "Criar unidades" },
    { name: "edit_unities", description: "Editar unidades" },
    { name: "delete_unities", description: "Eliminar unidades" },
  ],
  locations: [
    { name: "read_locations", description: "Visualizar localizações" },
    { name: "create_locations", description: "Criar localizações" },
    { name: "edit_locations", description: "Editar localizações" },
    { name: "delete_locations", description: "Eliminar localizações" },
  ],
  stockEntries: [
    { name: "read_stock_entries", description: "Visualizar entradas" },
    { name: "create_stock_entries", description: "Criar entradas" },
    { name: "edit_stock_entries", description: "Editar entradas" },
  ],
  stockExits: [
    { name: "read_stock_exits", description: "Visualizar saídas" },
    { name: "create_stock_exits", description: "Criar saídas" },
    { name: "edit_stock_exits", description: "Editar saídas" },
  ],
};

export default Accesses;
