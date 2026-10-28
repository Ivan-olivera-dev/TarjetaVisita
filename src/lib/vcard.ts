import { AUTHORIZED_PROFILE, type AuthorizedContactProfile } from '../data/profile';

export const VCARD_FILENAME = 'ivan-olivera.vcf';

export function generateVCardString(
  profile: AuthorizedContactProfile = AUTHORIZED_PROFILE
): string {
  // Uso estricto de CRLF (\r\n) exigido por RFC 2426 (vCard 3.0) para compatibilidad UTF-8 en iOS/Android.
  // Incluye TITLE:Software Engineer & Systems Specialist y omite cualquier campo TEL o dirección privada detallada.
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${profile.lastName};${profile.firstName};;;`,
    `FN:${profile.fullName}`,
    `TITLE:${profile.role}`,
    `EMAIL;TYPE=INTERNET,WORK:${profile.email}`,
    `URL;TYPE=WORK:${profile.portfolioUrl}`,
    `URL;TYPE=HOME:${profile.cardUrl}`,
    `ADR;TYPE=WORK:;;;${profile.city};;${profile.country}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedinUrl}`,
    `X-SOCIALPROFILE;TYPE=github:${profile.githubUrl}`,
    `NOTE:${profile.role} | ${profile.locationLabel} | Portfolio: ${profile.portfolioUrl} | Card: ${profile.cardUrl} | LinkedIn: ${profile.linkedinUrl} | GitHub: ${profile.githubUrl}`,
    'END:VCARD',
  ];

  return lines.join('\r\n') + '\r\n';
}

export function downloadVCard(
  profile: AuthorizedContactProfile = AUTHORIZED_PROFILE
): void {
  const vcfContent = generateVCardString(profile);
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
  const hasCreateObjectURL =
    typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';
  const url = hasCreateObjectURL
    ? URL.createObjectURL(blob)
    : `data:text/vcard;charset=utf-8,${encodeURIComponent(vcfContent)}`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', VCARD_FILENAME);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (hasCreateObjectURL && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url);
  }
}
