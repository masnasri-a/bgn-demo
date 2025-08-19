import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { useKabupatenStore, useProvinceStore } from './hook';

type Kabupaten = {
	kd_kabupaten: string;
	nm_kabupaten: string;
};

const KabupatenDropdown: React.FC = () => {
	const [kabupatens, setKabupatens] = useState<Kabupaten[]>([]);
	const { selected: selectedProv } = useProvinceStore();
    const { selected: selectedKab, setSelected: setSelectedKab } = useKabupatenStore();

	useEffect(() => {
		console.log("selectedProv di kabupaten : "+JSON.stringify(selectedProv));
		fetch('https://bgn-be.anakanjeng.site/maps/centroid?kd_propinsi=' + selectedProv?.kd_propinsi)
			.then((res) => res.json())
			.then((data) => {
				if (data && data.features) {
					const kabups = data.features.map((f: any) => ({
						kd_kabupaten: f.properties.kd_kabupaten,
						nm_kabupaten: f.properties.nm_kabupaten,
					}));
					setKabupatens(kabups);
				}
			});
	}, [selectedProv]);

	return (
		<Select
			value={selectedKab?.kd_kabupaten || 'all'}
			disabled={!selectedProv}
			onValueChange={(value) => {
				const selected = kabupatens.find(kab => kab.kd_kabupaten === value);
				if (selected) {
					setSelectedKab(selected);
				}
			}}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Pilih Kabupaten" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">Pilih Kabupaten</SelectItem>
				{kabupatens.map((kab) => (
					<SelectItem key={kab.kd_kabupaten} value={kab.kd_kabupaten}>
						{kab.nm_kabupaten}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default KabupatenDropdown;
