import gql from 'graphql-tag';
const typeDefs = gql`


input BookInput {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
}