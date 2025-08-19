import React, { useEffect, useState } from 'react';
import { useProvinceStore } from './hook';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Province = {
	kd_propinsi: string;
	nm_propinsi: string;
};

const ProvinsiDropdown: React.FC = () => {
	const [provinces, setProvinces] = useState<Province[]>([]);
    const { selected: selectedProv, setSelected: setSelectedProv } = useProvinceStore();
    const [disabled, setDisabled] = useState(false);

	useEffect(() => {
        const locationId = localStorage.getItem("kd_propinsi");
        const locationName = localStorage.getItem("nm_propinsi");

        if (locationId && locationName) {
            setDisabled(true);
        }

		fetch('https://bgn-be.anakanjeng.site/maps/centroid')
			.then((res) => res.json())
			.then((data) => {
				if (data && data.features) {
					const provs = data.features.map((f: any) => ({
						kd_propinsi: f.properties.kd_propinsi,
						nm_propinsi: f.properties.nm_propinsi,
					}));
					setProvinces(provs);
				}
			});
	}, []);

	return (
        <Select
            value={selectedProv?.kd_propinsi || 'all'}
            disabled={disabled}
            onValueChange={(value) => {
                const selected = provinces.find(prov => prov.kd_propinsi === value);
                if (selected) {
                    setSelectedProv(selected);
                }
            }}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Provinsi" />
            </SelectTrigger>
            <SelectContent>
                    <SelectItem value="all">Pilih Provinsi</SelectItem>
                {provinces.map((prov) => (
                    <SelectItem key={prov.kd_propinsi} value={prov.kd_propinsi}>
                        {prov.nm_propinsi}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
	);
};

export default ProvinsiDropdown;
