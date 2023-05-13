import { getRepository } from 'fireorm'
import Option from '../option'
import '../../../test/fireorm'

describe('Option', () => {
    const OptionRepository = getRepository(Option)
    it('can be created', async () => {
        const option = new Option()
        option.option = 'test'

        const optionDocument = await OptionRepository.create(option)
        const readOptionDocument = await OptionRepository.findById(
            optionDocument.id,
        )

        expect(readOptionDocument.option).toEqual(option.option)
    })

    it('can be updated', async () => {
        const option = new Option()
        option.option = 'test'

        const optionDocument = await OptionRepository.create(option)

        optionDocument.option = 'updated'

        await OptionRepository.update(optionDocument)

        const readOptionDocument = await OptionRepository.findById(
            optionDocument.id,
        )

        expect(readOptionDocument.option).toEqual(optionDocument.option)
    })
})
