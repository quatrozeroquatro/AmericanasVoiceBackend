# AmericanasVoiceBackend

Backend da solução Americanas Voice, voltada para deficientes visuais e quem mais desejar.


## Arquitetura

Nossa solução em resumo é uma feature que possibilitam pessoas a comprarem na Americanas por meio da voz. 
Para isso, utilizamos APIs da americanas, um serviço de backend e o serviço Autopilot da Twilio para fazer a inteligência conversacional.

Você pode fazer uso do nosso backend pela URL: https://americanas-voice.herokuapp.com/

Segue abaixo um diagrama da Arquitetura.

![Alt text](/arquitetura-aVoice.png?raw=true "Arquitetura da solução")

Irei passar pelos datalhes técnicos abaixo com base no fluxo de compra de um produto.

## Limitações Técnicas

Durante a implementação do produto, por motivos de segurança, não foi nos passadas as APIs utilizadas no processo de compra de um produto, logo fizemos um passo a passo do fluxo de compra e absorvemos as APIs públicas, que basicamente foram as APIs de pesquisa de produto.

Muitas APIs funcionam por chamadas locais, mas são bloqueadas quando subidas em um servidor, entao fizemos alguns testes e acabamos apenas implementando uma API com integração com a Americanas.

Atenção ao fato de, por viés de protótipo, não foi implementado a solução com multi usuários. Deixamos um usuário com dados mockados, que existe em nosso banco de dados, para que possa ser testada a conversação, que é o coração de nosso produto.

Nossa solução utiliza o Twilio para a inteligência conversacional. Infelizmente, hoje o Twilio é uma solução limitada no Brasil, pois as soluções conversacionais atendem apenas em inglês. Logo, será muito difícil o reconhecimento de chamadas que estejam fora do escopo de falas que selecionamos para o comando, por mais que o robô treine as falas, pois ele as compara com palavras de lingua inglesa. 

Reintero que escolhemos o Twilio pois além de ele ser uma das soluções patrocinadas pelo evento, sua documentação é bastante clara e direcionada tecnicamente.

Provavelmente temos mais limitações técnicas, mas acreditamos que as mais importante a serem citadas são as acima.

## Pesquisar um produto

Para pesquisar um produto, você pode inserir os seguintes comandos de voz:

 - Adicione <strong>{produto}</strong> por favor
 - Adiciona <strong>{produto}</strong> por favor
 - Adicione <strong>{produto}</strong> na minha lista
 - Adiciona <strong>{produto}</strong> na minha lista

Por trás, através do Twilio, adiciono essa tarefa a uma função serverless para integrar ao nosso backend, que faz consultas de produtos na API da Americanas. Segue abaixo o código da função Twilio:

~~~javascript
exports.handler = function(context, event, callback) {
    
    var axios = require('axios');
    const searchParameter = event.Field_product_Value;
    
    axios.get('https://americanas-voice.herokuapp.com/search/' + searchParameter)
    .then(function(response) {
        
        const products = response.data;
        
        const price = products[0].price;
        const productName = products[0].name;
        
        response = `Encontrei ${productName} em torno de ${price}`;
    
        let actions = [];  
        let say1 = {
            "say": response
        }
        let say2 = {
            "say": "Você tem preferência por alguma marca?"
        }
        
        let remember = {
            "remember" : {
                "produto": {
                    "product_name": searchParameter,
                    "product_label": productName,
                },
                "result_list": products,
            }
        }
        
        console.log(JSON.stringify(remember));
        
        let listen = {
            "listen": {
				"tasks": [
				    "filter-for-brand",
					"dont-filter"
				]
			}
		}
        
        actions.push(say1);
        actions.push(say2);
        actions.push(remember);
        actions.push(listen);
        
        let respObj = {
        	"actions": actions
        };
      
        callback(null, respObj);
    
    }).catch(function(error) {
        console.log('erro ')
        console.log(error)
      let actions = [];  
        let say = {
            "say": "Tivemos um pequeno problema. Tente novamente mais tarde."
        }
        actions.push(say);
        let respObj = {
        	"actions": actions
        };
      
        callback(null, respObj);
    });
	
};
~~~

Na ação de 'remember', inserimos os dados dos produtos para serem passados para as conversas seguintes e para o aplicativo.

Como visto no código acima, ele faz chamada com o <strong>endpoint</strong> <i>/search/:product</i> .

As APIs das Americanas que utilizamos foram:
 - https://mystique-v2-americanas.b2w.io/search
 - https://restql-server-api-v2-americanas.b2w.io/run-query/catalogo/product-buybox/2
 
## Filtro do produto por marca

<strong>OBS:</strong> Mais uma limitação que encontramos, foi o modo difícil de pesquisar o produto por filtro através da API, com diversos códigos além do nome da marca. Visto isso, não implementados essa funcionalidade, mas acredito que, desvendando os códigos por trás do nome da marca pesquisada, será bem fácil implementar esta funcionalidade.

Há a opção de filtrar ou não filtrar através dos comandos:

- Sim, quero a marca <strong>{marca}</strong>
- Pode, desejo a marca <strong>{marca}</strong>
- Tenho vontade de ver a marca <strong>{marca}</strong>
- Não, obrigado
- Não, obrigada
- Não tenho interesse

A partir daí, caso negativo, perguntamos se a pessoa deseja confirmar a adição dos produtos em sua lista. Segue abaixo a Função Twilio:

~~~javascript
exports.handler = function(context, event, callback) {
    
    var axios = require('axios');

    const memory = JSON.parse(event.Memory);
    
    response = `Então posso adicionar ${memory.produto.product_label} na sua lista?`;

    let actions = [];  
    
    let say = {
        "say": response
    }
    
    let remember = {
        "remember" : {
            "produto": {
                "product_name": memory.produto.product_name,
                "product_label": memory.produto.product_label,
            },
            "result_list": memory.produto.result_list,
        }
    }
    
    let listen = {
        "listen": {
			"tasks": [
				"add-product",
				"cancel-add"
			]
		}
    }
    
    actions.push(say);
    actions.push(remember);
    actions.push(listen);
    
    let respObj = {
    	"actions": actions
    };
  
    callback(null, respObj);
    
};
~~~

## Confirmar adição do produto à lista

Depois de ter certeza do produto que deseja, o usuário pode confirmar ou não a adição do produto em sua lista de compras a partir dos seguintes comandos:

- Ok
- Pode sim
- Com certeza
- Claro
- Sim
- Pode
- Não, obrigado

Caso negativo, o produto é tirado da memória. Caso afirmativo, é ralizada uma chamada ao nosso backend para adicionar o produto em uma lista no banco de dados e então é adicionado o item à lista de compras:

~~~javascript
exports.handler = function(context, event, callback) {
    
    var axios = require('axios');

    const memory = JSON.parse(event.Memory);
    
    axios.post('https://americanas-voice.herokuapp.com/add', memory.result_list)
    .then(function(response) {
        response = `O produto ${memory.produto.product_label} foi adicionado na sua lista`;
        
        let actions = [];  
    
        let say = {
            "say": response
        }
        
        let remember = {
            "remember" : {
                "produto": {
                    "product_name": memory.produto.product_name,
                    "product_label": memory.produto.product_label,
                },
                "result_list": memory.result_list,
            }
        }
        
        let listen = {
            "listen": {
    			"tasks": [
    				"list-products",
    				"remove-product",
    				"clear-wishlist",
    				"buy",
    				"add_wishlist"
    			]
    		}
        }
        
        actions.push(say);
        actions.push(remember);
        actions.push(listen);
        
        let respObj = {
        	"actions": actions
        };
      
        callback(null, respObj);
    })
    .catch(function(error) {
        console.log(error);
        let actions = [];  
        let say = {
            "say": "Tivemos um pequeno problema. Tente novamente mais tarde."
        }
        actions.push(say);
        let respObj = {
        	"actions": actions
        };
        
        callback(null, respObj);
    });
    
};
~~~

Utilizamos um banco de dados Postgresql hospedado no Heroku, assim como o backend. Ao final do resumo, direi um pouco sobre o modelo do banco que está sendo utilizado.

## Remover produto da lista de compras

Comando de voz:

- Quero tirar <strong>{produto}</strong>
- Desejo remover <strong>{produto}</strong>
  
A partir disso, a Função Twilio vai ao nosso backend e remove o produto especificado da lista.

~~~javascript
exports.handler = function(context, event, callback) {
    
    var axios = require('axios');
    const deleteParameter = event.Field_product_Value;
    
    axios.delete('https://americanas-voice.herokuapp.com/removeItem/' + deleteParameter)
    .then(function(response) {
        
        response = `${deleteParameter} removido da sua lista.`;
    
        let actions = [];  
        let say = {
            "say": response
        }
        
        console.log(JSON.stringify(remember));
        
        let listen = {
            "listen": {
				"tasks": [
				    "remove-product",
					"buy",
					"clear-wishlist",
					"list-products",
					"add_wishlist"
				]
			}
		}
        
        actions.push(say);
        actions.push(listen);
        
        let respObj = {
        	"actions": actions
        };
      
        callback(null, respObj);
    
    }).catch(function(error) {
        console.log('erro ')
        console.log(error)
      let actions = [];  
        let say = {
            "say": "Não foi possível encontrar esse produto na sua lista"
        }
        actions.push(say);
        let respObj = {
        	"actions": actions
        };
      
        callback(null, respObj);
    });
	
};
~~~

## Limpar lista de produtos

A partir dos comandos abaixo, você pode remover todos os produtos de sua lista de compras:

- Limpar lista de compras
- Desejo limpar minha lista de compras

Todos os dados são removidos, a partir da função abaixo:

~~~javascript
exports.handler = function(context, event, callback) {
    
    var axios = require('axios');

    const memory = JSON.parse(event.Memory);
    
    axios.delete('https://americanas-voice.herokuapp.com/clear')
    .then(function(response) {
        response = `Lista esvaziada com sucesso`;
        
        let actions = [];  
    
        let say = {
            "say": response
        }
        
        let listen = {
            "listen": {
    			"tasks": [
    				"remove-product",
    				"buy",
    				"clear-wishlist",
    				"list-products",
    				"add-wishlist"
    			]
    		}
        }
        
        actions.push(say);
        actions.push(listen);
        
        let respObj = {
        	"actions": actions
        };
      
        callback(null, respObj);
    })
    .catch(function(error) {
        console.log(error);
        let actions = [];  
        let say = {
            "say": "Tivemos um pequeno problema. Tente novamente mais tarde."
        }
        actions.push(say);
        let respObj = {
        	"actions": actions
        };
        
        callback(null, respObj);
    });
    
};
~~~

## Listar lista de compras

Aqui, você consegue ter uma visão de toda a sua lista de compras e o total do valor. Seguem os comandos abaixo:

- Leia a minha lista

O comando faz integração com o nosso backend, que por sua vez faz uma consulta no banco de dados:

~~~javascript
exports.handler = function(context, event, callback) {
    
    var axios = require('axios');
    
    const memory = JSON.parse(event.Memory);
    
    axios.get('https://americanas-voice.herokuapp.com/list')
    .then(async function(response) {
        
        const products = response.data;
        let actions = []; 
        var productsList = "";
        
        const responseString = await products.forEach(product => productsList += product.product_info.name + ", ");
        
        let say = {
            "say": products.length === 0 ? `Não há nada em sua lista ainda` : `${productsList}`
        }
        
        let remember = {
            "remember" : {
                "result_list": products,
            }
        }
        
        let listen = {
            "listen": {
				"tasks": [
					"add_wishlist",
					"clear-wishlist",
					"list-products",
					"buy",
					"remove-product"
				]
			}
		}
        
        actions.push(say);
        actions.push(remember);
        actions.push(listen);
        
        let respObj = {
        	"actions": actions
        };
      
        callback(null, respObj);
    
    }).catch(function(error) {
        console.log('erro ')
        console.log(error)
      let actions = [];  
        let say = {
            "say": "Tivemos um pequeno problema. Tente novamente mais tarde."
        }
        actions.push(say);
        let respObj = {
        	"actions": actions
        };
      
        callback(null, respObj);
    });
	
};
~~~

## Realizar Compra

- Desejo comprar os produtos
- Comprar
- Fechar Compra

A partir dos comandos acima a compra é finalizada. Como não temos integração com a Americanas, não vimos muito sentido em implementar esta funcionalidade no backend por hora. A ideia aqui é o usuário já possuir sua conta integrada com um cartão de crédito ou com o Ame Digital, fazendo a compra de forma descompliacada. Se necessário, é possível implementar um token SMS para autenticação, mas a ideia é ser uma solução fácil de usar para deficientes visuais, por isso tal funcionalidade não foi implementada.

## Escolher forma de entrega/retirada

Aqui, o usuário escolhe se deseja receber o produto em casa ou retirar na loja mais próxima:

- Desejo retirar na loja
- Desejo receber em casa

Mais uma vez, não foi possível implementar o backend desta funcionalidade por falta de integração com a API da Americanas. A ideia é você poder ter a localização do usuário e dizer se ele está dentro de uma loja ou qual a loja mais próxima dele.

No final da operação é perguntado se ele deseja limpar sua lista de compras ou não.

## Modelo de dados

Foi implementado um modelo bem básico dos dados para a implementação do backend. Abaixo segue o esquema de tabelas:

### Tabela users

id     | name        | cpf        
-------|-------------|-------------
serial | VARCHAR(50) | VARCHAR(50)

### Tabela payment

id     | card_number | security_code | card_name   | expiration_month | expiration_year 
-------|-------------|---------------|-------------|------------------|-----------------
serial | VARCHAR(50) | VARCHAR(50)   | VARCHAR(50) | integer          | integer         

### Tabela user_payment

id     | user_id | payment_id 
-------|---------|------------
serial | integer | integer    

### Tabela wishlist

id     | user_id | product_id | product_info | deleted_at 
-------|---------|------------|--------------|-----------
serial | integer | integer    | JSON         | TIMESTAMP  

## Futuro

Queremos implementar diversas outras funcionalidades a curto prazo:
- Exibição de ofertas;
- Recompras de produtos de forma mais inteligente (Exemplo: sempre compro pilhas, se peço para recomprar pilhas, ele já entende o tipo da pilha, pois já foi comprado outras vezes);
- Exibir apenas o valor do carrinho
