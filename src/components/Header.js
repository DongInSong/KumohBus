import React from "react";
import styled from 'styled-components';

const Header = ({ title }) => {
    return (
        <Wrapper>
            <Title>{title}</Title>
        </Wrapper>
    );
}

export default Header;


const Wrapper = styled.View`
  height: 100px;
  flex-direction: row;
  background-color: white;
  align-items: flex-end;
  padding-bottom: 10px;
`;

const Title = styled.Text`
  font-size: 25px;
  padding-horizontal: 10px;
`;