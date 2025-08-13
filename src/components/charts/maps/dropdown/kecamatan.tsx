import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { useKabupatenStore, useKecamatanStore, useProvinceStore } from './hook';

type Kecamatan = {
	kd_kecamatan: string;
	nm_kecamatan: string;
};

const KecamatanDropdown: React.FC = () => {
	const [kecamatans, setKecamatans] = useState<Kecamatan[]>([]);
	const {selected: selectedProv} = useProvinceStore();
	const { selected: selectedKab } = useKabupatenStore();
    const { selected: selectedKec, setSelected: setSelectedKec } = useKecamatanStore();

	useEffect(() => {
		console.log("selectedProv : "+JSON.stringify(selectedProv));
		console.log("selectedKab : "+JSON.stringify(selectedKab));
		fetch('https://bgn-be.anakanjeng.site/maps/centroid?kd_propinsi=' + selectedProv?.kd_propinsi + '&kd_kabupaten=' + selectedKab?.kd_kabupaten)
			.then((res) => res.json())
			.then((data) => {
				if (data && data.features) {
					const kecams = data.features.map((f: any) => ({
						kd_kecamatan: f.properties.kd_kecamatan,
						nm_kecamatan: f.properties.nm_kecamatan,
					}));
					setKecamatans(kecams);
				}
			});
	}, [selectedProv, selectedKab]);

	return (
		<Select
			value={selectedKec?.kd_kecamatan || 'all'}
			disabled={!selectedKab}
			onValueChange={(value) => {
				const selected = kecamatans.find(kec => kec.kd_kecamatan === value);
				if (selected) {
					setSelectedKec(selected);
				}
			}}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Pilih Kecamatan" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">Pilih Kecamatan</SelectItem>
				{kecamatans.map((kec) => (
					<SelectItem key={kec.kd_kecamatan} value={kec.kd_kecamatan}>
						{kec.nm_kecamatan}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default KecamatanDropdown;
