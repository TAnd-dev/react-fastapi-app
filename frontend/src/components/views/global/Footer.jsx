import css from '../../../styles/styles';

const { Footer: FooterStyles, SeparateLine } = css;

function FooterMenuGroup({ title, links }) {
    const liLinks = [];
    links.forEach(link => {
        liLinks.push(<li>{link}</li>);
    });
    return (
        <FooterStyles.FooterMenuGroup>
            <h2 style={{ margin: '15px 0' }}>{title}</h2>
            <SeparateLine />
            {links}
        </FooterStyles.FooterMenuGroup>
    );
}

export default function Footer() {
    const companyLinks = [
        <a
            style={{ color: 'white', fontSize: 'large', marginBottom: '10px' }}
            href="#"
        >
            About Company
        </a>,
        <a
            style={{ color: 'white', fontSize: 'large', marginBottom: '10px' }}
            href="#"
        >
            News
        </a>,
        <a
            style={{ color: 'white', fontSize: 'large', marginBottom: '10px' }}
            href="#"
        >
            Privacy Policy
        </a>,

        <a
            style={{ color: 'white', fontSize: 'large', marginBottom: '10px' }}
            href="#"
        >
            About Company
        </a>,
        <a
            style={{ color: 'white', fontSize: 'large', marginBottom: '10px' }}
            href="#"
        >
            News
        </a>,
        <a
            style={{ color: 'white', fontSize: 'large', marginBottom: '10px' }}
            href="#"
        >
            Privacy Policy
        </a>,

        <a
            style={{ color: 'white', fontSize: 'large', marginBottom: '10px' }}
            href="#"
        >
            About Company
        </a>,
    ];
    return (
        <FooterStyles.Footer>
            <FooterMenuGroup title="Company" links={companyLinks} />
            <FooterMenuGroup title="Company" links={companyLinks} />
            <FooterMenuGroup title="Company" links={companyLinks} />
        </FooterStyles.Footer>
    );
}
