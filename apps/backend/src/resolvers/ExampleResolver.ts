import type { ExampleInput } from '../Inputs/ExampleInput'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { ExampleEntity } from '../entities/ExampleEntity'

@Resolver()
export class ExampleResolver {
  @Query(() => [ExampleEntity])
  async examples(): Promise<ExampleEntity[]> {
    return ExampleEntity.find()
  }

  @Mutation(() => ExampleEntity)
  async createExample(
    @Arg('data') data: ExampleInput,
  ): Promise<ExampleEntity> {
    const example = ExampleEntity.create(data as Partial<ExampleEntity>) as ExampleEntity
    await example.save()
    return example
  }
}
