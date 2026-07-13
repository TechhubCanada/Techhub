import React from 'react';
import { render } from '@react-email/render';
import { Text } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

describe('EmailLayout', () => {
  it('uses TechHub footer links without Agilo or agency credits', async () => {
    const html = await render(
      React.createElement(
        EmailLayout,
        {},
        React.createElement(Text, null, 'Transactional test'),
      ),
    );

    expect(html).toContain('https://techhubcanada.com');
    expect(html).toContain('techhubcanada.com');
    expect(html).not.toContain('agilo.com');
    expect(html).not.toContain('Agilo');
    expect(html).not.toContain('agency.namankataria.com');
    expect(html).not.toContain('Agency by Naman Kataria');
  });
});
