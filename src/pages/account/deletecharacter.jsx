import React, { useEffect, useState, useCallback } from 'react';
import Panel from '../../components/Panel';
import { withSessionSsr } from '../../util/session';
import { fetchApi } from '../../util/request';
import FormWrapper from '../../components/FormWrapper';
import { deleteCharacterSchema } from 'src/schemas/DeleteCharacter';

const buttons = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
  { href: '/account', value: 'Back' },
];

export default function DeleteCharacter({ user }) {
  const [response, setResponse] = useState(null);
  const [data, setData] = useState(null);

  const fetchCharacters = useCallback(async () => {
    const response = await fetchApi('GET', `/api/accounts/${user.id}`);
    if (response.success) {
      setData({
        fields: [
          {
            as: 'select',
            name: 'name',
            label: { text: 'Name', size: 3 },
            size: 9,
            options: response.account.players.map((char) => ({
              value: char.name,
              text: char.name,
            })),
          },
          {
            type: 'password',
            name: 'password',
            label: { text: 'Password', size: 3 },
            size: 9,
          },
        ],
        initialValues: {
          name: response.account.players[0]?.name,
          password: '',
        },
      });
    }
  }, [user]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  if (!data) {
    return <Panel isLoading={true} />;
  }

  const onSubmit = async (values, { resetForm }) => {
    const response = await fetchApi('POST', '/api/accounts/deletecharacter', {
      data: {
        name: values.name,
        password: values.password,
      },
    });

    setResponse(response);
    resetForm();
  };

  return (
    <Panel header="Delete Character">
      <p align="center">
        To delete a character choose the character and enter your password.
      </p>

      <FormWrapper
        validationSchema={deleteCharacterSchema}
        onSubmit={onSubmit}
        fields={data.fields}
        buttons={buttons}
        response={response}
        initialValues={data.initialValues}
      />
    </Panel>
  );
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const { user } = req.session;
  if (!user) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});
