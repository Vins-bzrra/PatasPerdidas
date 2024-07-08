
<h1>Patas Perdidas</h1> 

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)

O Patas Perdidas foi desenvolvido como objeto de estudo para o desenvolvimento do meu Trabalho de Conclusão de Curso. O objetivo do projeto foi desenvolver um protótipo de uma rede social voltada para os donos de pets. A ideia foi criar um espaço interativo onde donos de pets pudessem divulgar informações sobre cuidados, projetos sociais voltados aos pets, como ações de vacinação, castração, adoção, entre outros, assim como divulgar informações sobre animais desaparecidos.

O projeto foi desenvolvido com o propósito de ser modular e de fácil implementação e personalização, por isso o backend foi projetado como uma API, bem como foi desenvolvido uma página web como uma proposta para o frontend. 

## 🔨 Funcionalidades do projeto
A API realiza o cadastro, login, publicação de postagens e comentários, bem como outros recursos esperados de uma rede social, como: curtir as publicações, página de perfil, personalização do perfil, uma timeline das publicações, entre outras funcionalidades.

O frontend apresentado como proposta do projeto foi desenvolvido utilizando HTML, CSS, JavaScript e o framework Bootstrap para fornecer uma interface responsiva, visto que muitas pessoas acessam redes sociais pelo telefone. Assim o visual se mantém consistente tanto para quem utilizar pelo computador quanto por quem utilizar pelo smartphone.

## 📁 Acesso ao projeto

Você pode [acessar o código fonte do projeto inicial](https://github.com/Vins-bzrra/PatasPerdidas) ou [baixá-lo](https://github.com/vins-bzrra/PatasPerdidas/archive/refs/heads/main.zip).

## 🛠️ Abrir e rodar o projeto

Após importar o projeto, você pode utilizar o Spring Tools Suite - STS. Para isso, clique em:

- **file**
- **Open Projects from File System**
- Clicar com o botão direito na pasta do projeto
- **Run As**
- **Spring Boot App**

Lembrando que o projeto usa por padrão o banco de dados PostgreSQL, antes de rodar o projeto, certifique-se que o banco de dados está instalado e configurado.

 ### Configuração

 Você pode configurar a conexão com qualquer banco de dados de sua preferência no arquivo `application.properties`. 
 Certifique-se de ter o banco de dados escolhido instalado e configurado corretamente.

 ### Build

 Se você pretende executar o projeto em um servidor dedicado, você pode gerar o arquivo `.war` para implentar a aplicação, para isso você deve executar o seguinte comando na pasta raíz do projeto:

 ```shell
 mvn clean package
 ```

 Lembrando que é necessário ter o maven instalado e configurado para executar o comando acima.
 
 Mas também é possível gerar o arquivo `.war` utilizando o STS. Para isso, você deve:
 - Clicar com o botão direito no projeto
 - **Run As**
 - **Maven build...**
 - No campo **Goals** adicione `clean package`

## ✔️ Técnicas e tecnologias utilizadas

- ``Java 8``
- ``Spring Boot Framework``
- ``PostgreSQL``
- ``Spring Tools Suite 4- STS``
- ``Bootstrap``
- ``HTML``
- ``CSS``
- ``JavaScript``

## Licença

Este projeto é distribuído sob a licença **Apache License 2.0**. Consulte o arquivo [License](LICENSE.md) para obter mais informações.

## Contato

- [Email](vbzrra12@gmail.com)
- [Linkedin](www.linkedin.com/in/vinícius-da-silva-bezerra-a8596617b)
