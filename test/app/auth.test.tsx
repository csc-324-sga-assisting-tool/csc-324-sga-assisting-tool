import {LogIn} from 'app/logIn';
import {expect, describe, it, assert} from 'vitest';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {DataModel, User} from 'lib/data';
import {getFirestore} from 'firebase/firestore';
import {getLocalAuth, getLocalFirebase} from '../utils/database.util';
import {FirestoreAuthModel} from 'lib/data/auth_model.firebase';
import {deterUserType} from 'app/auth';

const db = getFirestore();
const database = getLocalFirebase(db);
const dataModel = new DataModel(database);

const auth = getLocalAuth();
const authModel = new FirestoreAuthModel(auth);
const testUsers: User[] = [1, 2, 3].map(number => {
  return {
    id: `test_user_fe${number * 2}@studentorg.grinnell.edu`,
    name: `test_user_fe${number * 2}`,
    total_budget: 2000,
    remaining_budget: 1000,
    pending_event: 5,
    completed_event: 10,
    planned_event: 5,
    user_type: 'RSO',
  };
});
const testUsersSEPC: User[] = [1, 2, 3].map(number => {
  return {
    id: `test_user_fe${number * 2}_sepc@grinnell.edu`,
    name: `test_user_fe${number * 2}`,
    total_budget: 2000,
    remaining_budget: 1000,
    pending_event: 5,
    completed_event: 10,
    planned_event: 5,
    user_type: 'SEPC',
  };
});

function generateTestPassword(user: User) {
  const password = `${user.id} + ${Math.floor(
    Math.random() * user.total_budget
  )}`;
  return password;
}

const passwords: string[] = testUsers.map(user => {
  return generateTestPassword(user);
});
const passwordsse: string[] = testUsersSEPC.map(user => {
  return generateTestPassword(user);
});

describe('Test Login works as Expected', async () => {
  it('render login form to log in', async () => {
    await authModel.createUser(
      testUsers[0].id,
      passwords[0],
      testUsers[0],
      dataModel
    );
    const user = userEvent.setup();
    render(<LogIn TESTING_FLAG={true} />);
    expect(screen.queryByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-up-form-button')).toBeInTheDocument();
    const formInputs = await screen.findAllByTestId(/login-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    const emailInput = await screen.findByTestId('login-form-email');
    const passwordInput = await screen.findByTestId('login-form-password');
    const submitButton = await screen.findByTestId('login-form-submit');

    await user.type(emailInput, testUsers[0].id);
    await user.type(passwordInput, passwords[0]);
    await user.click(submitButton);

    const userId = await authModel.getSignedInUser();

    assert.equal(userId, testUsers[0].id);
    await authModel.signOut();
  });
  it('render login form to log in but fail with bad credentials', async () => {
    const user = userEvent.setup();
    render(<LogIn TESTING_FLAG={true} />);
    expect(screen.queryByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-up-form-button')).toBeInTheDocument();
    const formInputs = await screen.findAllByTestId(/login-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    const emailInput = await screen.findByTestId('login-form-email');
    const passwordInput = await screen.findByTestId('login-form-password');
    const submitButton = await screen.findByTestId('login-form-submit');

    await user.type(emailInput, testUsers[0].id);
    await user.type(passwordInput, passwords[2]);
    await user.click(submitButton);

    expect(await screen.findByText('Sign In Failed:', {exact: false}));
  });
  it('render login form to create account with correct type RSO', async () => {
    const user = userEvent.setup();
    render(<LogIn TESTING_FLAG={true} />);
    expect(screen.queryByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-up-form-button')).toBeInTheDocument();
    await user.click(screen.getByTestId('sign-up-form-button'));
    const formInputs = await screen.findAllByTestId(/sign-up-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    const emailInput = await screen.findByTestId('sign-up-form-email');
    const passwordInput = await screen.findByTestId('sign-up-form-password');
    const nameInput = await screen.findByTestId('sign-up-form-name');
    const budgetInput = await screen.findByTestId('sign-up-form-budget');
    const submitButton = await screen.findByTestId('sign-up-form-submit');

    await user.type(emailInput, testUsers[1].id);
    await user.type(passwordInput, passwords[1]);
    await user.type(nameInput, testUsers[1].name);
    await user.type(budgetInput, testUsers[1].total_budget.toString());
    await user.click(submitButton);

    const user1 = await dataModel.getUser(testUsers[1].id);

    assert.equal(user1!.id, testUsers[1].id);
    assert.equal(user1!.user_type, testUsers[1].user_type);

    const userId = await authModel.getSignedInUser();

    assert.equal(userId, testUsers[1].id);
    await authModel.signOut();
  });
  it('render login form to create account with correct type SEPC', async () => {
    const user = userEvent.setup();
    render(<LogIn TESTING_FLAG={true} />);
    expect(screen.queryByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-up-form-button')).toBeInTheDocument();
    await user.click(screen.getByTestId('sign-up-form-button'));
    const formInputs = await screen.findAllByTestId(/sign-up-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    const emailInput = await screen.findByTestId('sign-up-form-email');
    const passwordInput = await screen.findByTestId('sign-up-form-password');
    const nameInput = await screen.findByTestId('sign-up-form-name');
    const budgetInput = await screen.findByTestId('sign-up-form-budget');
    const submitButton = await screen.findByTestId('sign-up-form-submit');

    await user.type(emailInput, testUsersSEPC[0].id);
    await user.type(passwordInput, passwordsse[0]);
    await user.type(nameInput, testUsersSEPC[0].name);
    await user.type(budgetInput, testUsersSEPC[0].total_budget.toString());
    await user.click(submitButton);

    const user1 = await dataModel.getUser(testUsersSEPC[0].id);

    assert.equal(user1!.id, testUsersSEPC[0].id);
    assert.equal(user1!.user_type, testUsersSEPC[0].user_type);

    const userId = await authModel.getSignedInUser();

    assert.equal(userId, testUsersSEPC[0].id);

    await authModel.signOut();
  });
  it('render login form with empty create account form', async () => {
    const user = userEvent.setup();
    render(<LogIn TESTING_FLAG={true} />);
    expect(screen.queryByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-up-form-button')).toBeInTheDocument();
    await user.click(screen.getByTestId('sign-up-form-button'));
    const formInputs = await screen.findAllByTestId(/sign-up-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    const emailInput = await screen.findByTestId('sign-up-form-email');
    const passwordInput = await screen.findByTestId('sign-up-form-password');
    // const nameInput = await screen.findByTestId('sign-up-form-name');
    // const budgetInput = await screen.findByTestId('sign-up-form-budget');
    // const typeInput = await screen.findByTestId('sign-up-form-input-user_type');
    const submitButton = await screen.findByTestId('sign-up-form-submit');

    await user.type(emailInput, testUsers[2].id);
    await user.type(passwordInput, passwords[2]);
    // await user.type(nameInput, testUsers[1].name);
    // await user.type(budgetInput, testUsers[1].total_budget.toString());
    // await user.selectOptions(typeInput, testUsers[1].user_type);
    await user.click(submitButton);
    await user.click(submitButton);

    try {
      await authModel.signIn(testUsers[2].id, passwords[2]);
      assert.fail('Sign In fails');
    } catch (error) {
      if (error instanceof Error) {
        assert.equal(
          error.message,
          'Firebase: Error (auth/user-not-found).',
          'Expected error message not received'
        );
      } else {
        assert.fail('Caught an error, but it is not an instance of Error');
      }
    }

    await expect(
      async () => await authModel.getSignedInUser()
    ).rejects.toThrowError();
  });
  it('Ensure usertype parse works for create user', async () => {
    const type = await deterUserType('sgatreasurer@grinnell.edu');
    assert.equal(type, 'SGA_Treasurer');
    const type1 = await deterUserType('sgat@studentorg.grinnell.edu');
    assert.equal(type1, 'RSO');
    const type2 = await deterUserType('sgaat@grinnell.edu');
    assert.equal(type2, 'SGA_Assistant_Treasurer');
    const type3 = await deterUserType('sgasepc@grinnell.edu');
    assert.equal(type3, 'SEPC');
  });
});
