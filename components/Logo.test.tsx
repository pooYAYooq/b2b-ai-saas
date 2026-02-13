import React from 'react'
import { render } from '@testing-library/react'
import { Logo } from './logo'

describe('Logo', () => {
  it('renders an svg', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('uses currentColor when uniColor is true', () => {
    const { container } = render(<Logo uniColor />)
    const firstPath = container.querySelector('path')
    expect(firstPath).toBeInTheDocument()
    expect(firstPath).toHaveAttribute('fill', 'currentColor')
  })
})
