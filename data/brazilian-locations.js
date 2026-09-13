const BRAZIL_LOCATIONS = {
  "AC": [
    "Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasiléia", "Senador Guiomard", "Plácido de Castro", "Xapuri", "Mâncio Lima"
  ],
  "AL": [
    "Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "União dos Palmares", "Penedo", "São Miguel dos Campos", "Campo Alegre", "Coruripe", "Marechal Deodoro", "Delmiro Gouveia", "Santana do Ipanema"
  ],
  "AP": [
    "Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande", "Mazagão", "Tartarugalzinho", "Pedra Branca do Amapari"
  ],
  "AM": [
    "Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tabatinga", "Maués", "Tefé", "Manicoré", "Humaitá", "Iranduba", "São Gabriel da Cachoeira"
  ],
  "BA": [
    "Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Itabuna", "Lauro de Freitas", "Ilhéus", "Jequié", "Teixeira de Freitas", "Alagoinhas", "Barreiras", "Porto Seguro", "Simões Filho", "Paulo Afonso", "Eunápolis", "Santo Antônio de Jesus", "Valença", "Candeias", "Guanambi", "Jacobina", "Serrinha", "Senhor do Bonfim", "Dias d'Ávila", "Luís Eduardo Magalhães", "Itapetinga", "Irecê", "Casa Nova", "Brumado", "Bom Jesus da Lapa"
  ],
  "CE": [
    "Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Pacatuba", "Aquiraz", "Russas", "Canindé", "Tianguá", "Crateús", "Aracati", "Cascavel", "Pacajus", "Icó", "Horizonte", "Camocim", "Morada Nova", "Acaraú", "Viçosa do Ceará", "Barbalha", "Limoeiro do Norte", "Tauá", "Trairi", "Granja"
  ],
  "DF": [
    "Brasília", "Ceilândia", "Taguatinga", "Samambaia", "Plano Piloto", "Águas Claras", "Guará", "Gama", "Recanto das Emas", "Santa Maria", "Sobradinho", "São Sebastião", "Vicente Pires", "Riacho Fundo", "Planaltina", "Paranoá", "Núcleo Bandeirante", "Brazlândia", "Sudoeste/Octogonal", "Cruzeiro"
  ],
  "ES": [
    "Vitória", "Vila Velha", "Serra", "Cariacica", "Cachoeiro de Itapemirim", "Linhares", "São Mateus", "Guarapari", "Colatina", "Aracruz", "Viana", "Nova Venécia", "Marataízes", "Castelo", "Barra de São Francisco", "Santa Maria de Jetibá", "Domingos Martins", "Anchieta", "Itapemirim", "Afonso Cláudio"
  ],
  "GO": [
    "Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Águas Lindas de Goiás", "Luziânia", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama", "Senador Canedo", "Itumbiara", "Catalão", "Jataí", "Planaltina", "Caldas Novas", "Santo Antônio do Descoberto", "Goianésia", "Cidade Ocidental", "Mineiros", "Cristalina", "Inhumas", "Jaraguá", "Quirinópolis", "Niquelândia", "Morrinhos", "Goianira", "Porangatu"
  ],
  "MA": [
    "São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês", "Barra do Corda", "Pinheiro", "Chapadinha", "Santa Luzia", "Buriticupu", "Grajaú", "Itapecuru Mirim", "Coroatá", "Tutóia"
  ],
  "MT": [
    "Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças", "Cáceres", "Alta Floresta", "Nova Mutum", "Pontes e Lacerda", "Campo Verde", "Juína", "Colíder", "Guarantã do Norte", "Juara", "Barra do Bugres"
  ],
  "MS": [
    "Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Aquidauana", "Sidrolândia", "Paranaíba", "Maracaju", "Coxim", "Amambai", "Rio Brilhante", "Caarapó", "Miranda", "São Gabriel do Oeste", "Jardim", "Aparecida do Taboado", "Anastácio"
  ],
  "MG": [
    "Betim", "Contagem", "Belo Horizonte", "Nova Lima", "Ibirité", "Sabará", "Santa Luzia", "Ribeirão das Neves", "Vespasiano", "Sete Lagoas", "Lagoa Santa", "Pedro Leopoldo", "Sarzedo", "Mário Campos", "São Joaquim de Bicas", "Igarapé", "Esmeraldas", "Brumadinho", "Mateus Leme", "Juatuba", "Divinópolis", "Itaúna", "Pará de Minas", "Uberlândia", "Uberaba", "Juiz de Fora", "Montes Claros", "Governador Valadares", "Ipatinga", "Coronel Fabriciano", "Timóteo", "Poços de Caldas", "Pouso Alegre", "Varginha", "Passos", "Lavras", "Itajubá", "Alfenas", "Três Corações", "São Sebastião do Paraíso", "Patos de Minas", "Araguari", "Patrocínio", "Ituiutaba", "Unaí", "Paracatu", "Barbacena", "São João del Rei", "Conselheiro Lafaiete", "Ouro Preto", "Mariana", "Itabira", "João Monlevade", "Teófilo Otoni", "Muriaé", "Ubá", "Cataguases", "Viçosa", "Manhuaçu", "Caratinga", "Curvelo", "Diamantina", "Januária", "Pirapora", "Salinas", "Almenara", "Nanuque", "Capelinha", "Guanhães", "Ponte Nova", "Santos Dumont", "Oliveira", "Campo Belo", "Machado", "Extrema", "Santa Rita do Sapucaí"
  ],
  "PA": [
    "Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas", "Castanhal", "Abaetetuba", "Cametá", "Marituba", "Bragança", "São Félix do Xingu", "Barcarena", "Altamira", "Tucuruí", "Paragominas", "Tailândia", "Breves", "Itaituba", "Redenção", "Moju"
  ],
  "PB": [
    "João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Cabedelo", "Guarabira", "Mamanguape", "Queimadas", "Monteiro", "Esperança", "Pombal", "Catolé do Rocha"
  ],
  "PR": [
    "Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Araucária", "Toledo", "Apucarana", "Pinhais", "Campo Largo", "Arapongas", "Almirante Tamandaré", "Piraquara", "Umuarama", "Cambé", "Fazenda Rio Grande", "Sarandi", "Campo Mourão", "Francisco Beltrão", "Paranavaí", "Pato Branco", "Cianorte", "Telêmaco Borba", "Castro", "Rolândia"
  ],
  "PE": [
    "Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão", "Igarassu", "São Lourenço da Mata", "Santa Cruz do Capibaribe", "Abreu e Lima", "Ipojuca", "Serra Talhada", "Araripina", "Gravatá", "Carpina", "Goiana", "Belo Jardim", "Arcoverde", "Ouricuri", "Escada", "Pesqueira", "Surubim", "Palmares", "Bezerros"
  ],
  "PI": [
    "Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Barras", "Campo Maior", "União", "Altos", "Esperantina", "José de Freitas", "Pedro II", "Oeiras", "São Raimundo Nonato", "Miguel Alves"
  ],
  "RJ": [
    "Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "Campos dos Goytacazes", "São João de Meriti", "Petrópolis", "Volta Redonda", "Macaé", "Magé", "Itaboraí", "Cabo Frio", "Angra dos Reis", "Nova Friburgo", "Barra Mansa", "Teresópolis", "Mesquita", "Nilópolis", "Maricá", "Queimados", "Rio das Ostras", "Resende", "Araruama", "Itaperuna", "São Pedro da Aldeia", "Japeri", "Itaguaí", "Saquarema", "Seropédica", "Três Rios", "Valença", "Guapimirim", "Rio Bonito", "Cachoeiras de Macacu", "Paracambi", "Armação dos Búzios", "Mangaratiba", "Casimiro de Abreu", "São Fidélis", "Santo Antônio de Pádua", "Paraty", "Arraial do Cabo"
  ],
  "RN": [
    "Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Ceará-Mirim", "Macaíba", "Caicó", "Açu", "Currais Novos", "São José de Mipibu", "Santa Cruz", "Nova Cruz", "Apodi", "João Câmara", "Canguaretama", "Touros", "Pau dos Ferros", "Areia Branca"
  ],
  "RS": [
    "Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande", "Alvorada", "Passo Fundo", "Sapucaia do Sul", "Uruguaiana", "Santa Cruz do Sul", "Cachoeirinha", "Bagé", "Bento Gonçalves", "Erechim", "Guaíba", "Cachoeira do Sul", "Santana do Livramento", "Esteio", "Ijuí", "Sapiranga", "Lajeado", "Farroupilha", "Vacaria", "Santo Ângelo", "Cruz Alta", "Gramado", "Canela"
  ],
  "RO": [
    "Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim", "Ouro Preto do Oeste", "Pimenta Bueno", "Buritis", "Machadinho D'Oeste"
  ],
  "RR": [
    "Boa Vista", "Rorainópolis", "Caracaraí", "Pacaraima", "Cantá", "Mucajaí", "Alto Alegre"
  ],
  "SC": [
    "Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma", "Chapecó", "Itajaí", "Jaraguá do Sul", "Palhoça", "Balneário Camboriú", "Brusque", "Tubarão", "São Bento do Sul", "Caçador", "Camboriú", "Navegantes", "Concórdia", "Rio do Sul", "Gaspar", "Biguaçu", "Indaial", "Araranguá", "Itapema", "Mafra", "Canoinhas", "Içara", "Videira", "Lages", "São Francisco do Sul", "Laguna"
  ],
  "SP": [
    "São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "São José dos Campos", "Osasco", "Ribeirão Preto", "Sorocaba", "Santos", "Mauá", "São José do Rio Preto", "Mogi das Cruzes", "Diadema", "Jundiaí", "Piracicaba", "Carapicuíba", "Bauru", "Itaquaquecetuba", "São Vicente", "Franca", "Praia Grande", "Guarujá", "Taubaté", "Limeira", "Suzano", "Taboão da Serra", "Sumaré", "Barueri", "Embu das Artes", "São Carlos", "Indaiatuba", "Cotia", "Americana", "Marília", "Itapevi", "Araraquara", "Jacareí", "Hortolândia", "Presidente Prudente", "Rio Claro", "Araçatuba", "Santa Bárbara d'Oeste", "Ferraz de Vasconcelos", "Francisco Morato", "Itapecerica da Serra", "Itu", "Bragança Paulista", "Pindamonhangaba", "São Caetano do Sul", "Itapetininga", "Mogi Guaçu", "Franco da Rocha", "Jaú", "Botucatu", "Atibaia", "Santana de Parnaíba", "Araras", "Valinhos", "Sertãozinho", "Jandira", "Birigui", "Votorantim", "Barretos", "Catanduva", "Guaratinguetá", "Várzea Paulista", "Tatuí", "Caraguatatuba", "Itatiba", "Salto", "Poá", "Ourinhos", "Paulínia", "Assis", "Leme", "Itanhaém", "Caieiras", "Mairiporã", "Votuporanga", "Ubatuba", "Avaré", "São Sebastião"
  ],
  "SE": [
    "Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Tobias Barreto", "Simão Dias", "Itabaianinha", "Poço Redondo", "Nossa Senhora da Glória", "Propriá", "Capela", "Itaporanga d'Ajuda", "Laranjeiras"
  ],
  "TO": [
    "Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Araguatins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Dianópolis", "Formoso do Araguaia", "Taguatinga"
  ]
};
