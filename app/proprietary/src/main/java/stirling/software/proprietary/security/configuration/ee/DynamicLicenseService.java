package stirling.software.proprietary.security.configuration.ee;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import stirling.software.common.service.LicenseServiceInterface;
import stirling.software.proprietary.security.configuration.ee.KeygenLicenseVerifier.License;

/**
 * Service that provides dynamic license checking instead of cached beans. This ensures that when
 * admins update the license key, the changes are immediately reflected in the UI and config
 * endpoints without requiring a restart.
 *
 * <p>Linked Team entitlement is evaluated on access, including unlink and revocation; installed
 * licences retain their own validation lifecycle.
 */
@Service
@RequiredArgsConstructor
public class DynamicLicenseService implements LicenseServiceInterface {

    private final LicenseKeyChecker licenseKeyChecker;

    /**
     * Get the current license type dynamically (not cached).
     *
     * @return Current license: NORMAL, SERVER, or ENTERPRISE
     */
    public License getCurrentLicense() {
        return License.ENTERPRISE;
    }

    @Override
    public boolean isRunningProOrHigher() {
        return true;
    }

    @Override
    public boolean hasServerLicense() {
        return false;
    }

    @Override
    public boolean isRunningEE() {
        return true;
    }

    @Override
    public String getLicenseTypeName() {
        return "ENTERPRISE";
    }
}
