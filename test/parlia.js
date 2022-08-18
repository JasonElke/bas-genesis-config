/** @var artifacts {Array} */
/** @var web3 {Web3} */
/** @function contract */
/** @function it */
/** @function before */
/** @var assert */

const {newMockContract} = require('./helper')

contract("Parlia", async (accounts) => {
  const [owner] = accounts
  it("can add or remove validator", async () => {
    const {parlia} = await newMockContract(owner);
    assert.equal(await parlia.isValidator('0xaB5e53D86C5116024Ba59C702D8Bd0C470A05Fd7'), false)
    const res1 = await parlia.addValidator('0xaB5e53D86C5116024Ba59C702D8Bd0C470A05Fd7')
    assert.equal(res1.logs[0].event, 'ValidatorAdded')
    assert.equal(res1.logs[0].args.validator, '0xaB5e53D86C5116024Ba59C702D8Bd0C470A05Fd7')
    assert.equal(await parlia.isValidator('0xaB5e53D86C5116024Ba59C702D8Bd0C470A05Fd7'), true)
    const validators1 = await parlia.getValidators()
    assert.deepEqual(validators1, ['0xaB5e53D86C5116024Ba59C702D8Bd0C470A05Fd7'])
    const res2 = await parlia.removeValidator('0xaB5e53D86C5116024Ba59C702D8Bd0C470A05Fd7')
    assert.equal(res2.logs[0].event, 'ValidatorRemoved')
    assert.equal(res2.logs[0].args.validator, '0xaB5e53D86C5116024Ba59C702D8Bd0C470A05Fd7')
    assert.equal(await parlia.isValidator('0xaB5e53D86C5116024Ba59C702D8Bd0C470A05Fd7'), false)
    const validators2 = await parlia.getValidators()
    assert.deepEqual(validators2, [])
  });
  it("remove firstly added validator", async () => {
    const {parlia} = await newMockContract(owner)
    await parlia.addValidator('0x0000000000000000000000000000000000000001')
    await parlia.addValidator('0x0000000000000000000000000000000000000002')
    await parlia.addValidator('0x0000000000000000000000000000000000000003')
    assert.deepEqual(Array.from(await parlia.getValidators()).sort(), [
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
    ])
    await parlia.removeValidator('0x0000000000000000000000000000000000000001')
    assert.deepEqual(Array.from(await parlia.getValidators()).sort(), [
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
    ])
  })
  it("remove validator from the center of the list", async () => {
    const {parlia} = await newMockContract(owner)
    await parlia.addValidator('0x0000000000000000000000000000000000000001')
    await parlia.addValidator('0x0000000000000000000000000000000000000002')
    await parlia.addValidator('0x0000000000000000000000000000000000000003')
    assert.deepEqual(Array.from(await parlia.getValidators()).sort(), [
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
    ])
    await parlia.removeValidator('0x0000000000000000000000000000000000000002')
    assert.deepEqual(Array.from(await parlia.getValidators()).sort(), [
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000003',
    ])
  })
  it("remove last validator from the list", async () => {
    const {parlia} = await newMockContract(owner)
    await parlia.addValidator('0x0000000000000000000000000000000000000001')
    await parlia.addValidator('0x0000000000000000000000000000000000000002')
    await parlia.addValidator('0x0000000000000000000000000000000000000003')
    assert.deepEqual(Array.from(await parlia.getValidators()).sort(), [
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
    ])
    await parlia.removeValidator('0x0000000000000000000000000000000000000003')
    assert.deepEqual(Array.from(await parlia.getValidators()).sort(), [
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
    ])
  })
});
