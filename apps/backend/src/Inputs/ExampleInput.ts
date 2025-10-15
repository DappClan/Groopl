import { Length } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class ExampleInput {
  @Field()
  @Length(1, 255)
  name: string

  @Field({ nullable: true })
  @Length(0, 500)
  description?: string
}
