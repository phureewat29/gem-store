import axios from 'axios';
import { expect } from '@jest/globals';
import { faker } from '@faker-js/faker';

describe('Gem Store (e2e)', () => {
  const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' },
  });

  const registerUser = async (user) => {
    const resp = await instance.post('/users/register', {
      email: user.email,
      password: user.password,
    });
    expect(resp.data.state).toBeTruthy();
    return user;
  };

  const authenticateUser = async (user) => {
    const resp = await instance.post('/users/login', {
      email: user.email,
      password: user.password,
    });
    expect(resp.data.state).toBeTruthy();
    user.token = resp.data.data.token;
    return user;
  };

  const checkUser = async (user) => {
    const resp = await instance.get('/users/me');
    expect(resp.data.state).toBeTruthy();
    expect(resp.data.data.email).toBe(user.email);
  };

  const checkGemBalance = async (balance) => {
    const resp = await instance.get('/ledgers');
    const gemLedger = resp.data.data.find(
      (ledger) => ledger.currency === 'gem',
    );
    expect(gemLedger.balance).toBe(balance);
  };

  const transferGems = async (amount, recipientEmail) => {
    const resp = await instance.post('/ledgers/transfer', {
      currency: 'gem',
      amount: amount,
      email: recipientEmail,
    });
    expect(resp.data.state).toBeTruthy();
    expect(resp.data.data.balance).toBe(100 - amount);
  };

  const checkLedgerEntries = async (type, amount) => {
    const resp = await instance.get('/ledgers/entries', {
      params: { type: type, limit: 50, page: 1, currency: 'gem' },
    });
    expect(resp.data.state).toBeTruthy();
    expect(
      resp.data.data.items.some(
        (entry) =>
          entry.entries_type === type &&
          entry.entries_currency === 'gem' &&
          entry.entries_amount === amount,
      ),
    ).toBeTruthy();
    expect(resp.data.data.page).toEqual(1);
    expect(resp.data.data.total).toEqual(1);
    expect(resp.data.data.limit).toEqual(50);
  };

  it('should perform all functionalities', async () => {
    const userA = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      token: null,
    };
    const userB = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      token: null,
    };

    // register two users
    await Promise.all([userA, userB].map(registerUser));

    // authenticate users
    await Promise.all([userA, userB].map(authenticateUser));

    // set default authorization header as userA
    instance.defaults.headers.common['Authorization'] = `Bearer ${userA.token}`;

    // check existing user
    await checkUser(userA);

    // check initial GEM balance of userA
    await checkGemBalance('100.00');

    // transfer 10.5 GEM to userB
    await transferGems(10.5, userB.email);

    // query ledger entries of userA
    await checkLedgerEntries('credit', '10.50');

    // re-authenticate as userB
    instance.defaults.headers.common['Authorization'] = `Bearer ${userB.token}`;

    // check userB ledger balance
    await checkGemBalance('110.50');

    // query ledger entries of userB
    await checkLedgerEntries('debit', '10.50');
  });
});
